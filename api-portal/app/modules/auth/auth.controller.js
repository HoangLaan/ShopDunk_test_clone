const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const authService = require('./auth.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const MessageResponse = require('../../common/responses/message.response');
const stringHelper = require('../../common/helpers/string.helper');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const userService = require('../user/user.service');
const logger = require('../../common/classes/logger.class');

const createToken = async (req, res, next) => {
    try {
        const { user_name, password } = req.body;
        const lcUsername = stringHelper.toLowerCaseString(user_name);
        const user = await authService.getUserByUsername(lcUsername);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, {}, RESPONSE_MSG.AUTH.LOGIN.FAILED));
        }

        // Log when user login system
        userService
            .logUserLogin({
                user_id: user.user_id,
                user_name: user.user_name,
                user_agent: JSON.stringify(req.useragent),
            })
            .then(() => {
                return null;
            })
            .catch(() => {});

        // create a token
        const tokenData = await authService.generateToken(user);
        return res.json(new SingleResponse(tokenData, RESPONSE_MSG.AUTH.LOGIN.SUCCESS));
    } catch (error) {
        logger.error(error, { function: 'auth.service.createToken' });
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.AUTH.LOGIN.FAILED));
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const tokenData = await authService.refreshToken(refreshToken);
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
        const user = await userService.getProfile(req.auth.user_id);
        return res.json(new SingleResponse(user));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const logout = async (req, res, next) => {
    try {
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
