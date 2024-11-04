const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const authService = require('./auth.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const MessageResponse = require('../../common/responses/message.response');
const stringHelper = require('../../common/helpers/string.helper');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const userService = require('../user/user.service');
const {subscribe} = require('../../common/services/topic.service');
const BULLMQ = require('../../bullmq');

const createToken = async (req, res, next) => {
    try {
        const {user_name, password, platform, device_token = null, biometricKey, device_name} = req.body;
        let user = null;
        if (biometricKey) {
            const descryptBiometric = stringHelper.decryptString(biometricKey);
            user = await authService.getUserByBimometric(descryptBiometric);
            if (!user || !user.user_id) {
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, {}, RESPONSE_MSG.AUTH.LOGIN.BIOMETRIC_FAILED));
            }
        } else {
            const lcUsername = stringHelper.toLowerCaseString(user_name);
            user = await authService.getUserByUsername(lcUsername);
            if (!user || !user.user_id || !bcrypt.compareSync(password, user.password)) {
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, {}, RESPONSE_MSG.AUTH.LOGIN.FAILED));
            }
        }
        // Log when user login system
        // push thong bao mail neu da co thiet bi khac dang nhap
        const dt = await userService.getDeviceTokenByUsername(user_name ? user_name : user.user_name);
        if (dt) {
            // console.log("🚀 ~ file: auth.controller.js ~ line 13 ~ userlogin")
            BULLMQ.push({
                type: 'auth.send',
                payload: {
                    token: dt.device_token,
                    user_send: user.user_name,
                    device_name: device_name,
                    platform: dt.platform,
                },
            });
        }

        userService
            .logUserLogin({
                user_id: user.user_id,
                user_name: user.user_name,
                user_agent: JSON.stringify(req.useragent),
                device_token: device_token,
                platform: platform,
                device_name: device_name,
            })
            .then(() => {
                return null;
            })
            .catch(() => {});
        if (device_token) {
            // console.log("🚀 ~ file: auth.controller.js ~ line 43 ~ createToken ~ device_token", device_token)
            subscribe(device_token);
        }
        // create a token
        const tokenData = await authService.generateToken(user);

        // create login_token in database
        await userService.createUserToken(tokenData.accessToken, tokenData.refreshToken, user.user_name, null);
        return res.json(new SingleResponse(tokenData, RESPONSE_MSG.AUTH.LOGIN.SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;
        const tokenData = await authService.refreshToken(refreshToken);
        const isactive = await userService.checkToken(refreshToken);

        if (!isactive) {
            return res.json({
                data: null,
                message: 'logged in on another device',
                status: 10010,
                errors: null,
            });
        }
        await userService.createUserToken(tokenData.accessToken, tokenData.refreshToken, null, refreshToken);
        if (tokenData.error) {
            return next(
                new ErrorResponse(
                    httpStatus.BAD_REQUEST,
                    tokenData.error,
                    RESPONSE_MSG.AUTH.LOGIN.REFRESH_TOKEN_FAILED,
                ),
            );
        }

        return res.json(new SingleResponse(tokenData, RESPONSE_MSG.REQUEST_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.detailUser(req.auth.user_id);
        return res.json(new SingleResponse(user));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const logout = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await userService.handleUserLogout(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new MessageResponse(RESPONSE_MSG.AUTH.LOGOUT.SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    createToken,
    refreshToken,
    getProfile,
    logout,
};
