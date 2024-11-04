const httpStatus = require('http-status');
const userService = require('./user.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const Queue = require('../../common/services/bullmq.service');
/**
 * Get list user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListUser = async (req, res, next) => {
    try {
        const {user_id, user_name} = req.auth;
        const users = await userService.getListUser({...req.query, user_id, user_name});
        return res.json(new ListResponse(users['data'], users['total'], users['page'], users['limit']));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createUser = async (req, res, next) => {
    try {
        let params = req.body;
        const userName = params.user_name;
        params.user_id = null;
        // Check user_name valid
        if (isNaN(userName)) {
            return next(new ValidationResponse('user_name', 'invalid'));
        }

        // Check user name exists
        const userExist = await userService.findByUserName(req.body.user_name);
        if (userExist) {
            const user = await userService.generateUsername();
            params.user_name = user.user_name;
        }

        // Check email exists
        const emailExist = await userService.findByEmail(req.body.email);
        if (emailExist) {
            return next(new ValidationResponse('email', 'already  exists'));
        }

        const result = await userService.createUser(params);

        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.USER.CREATE_FAILED));
        }

        return res.json(new SingleResponse(result, RESPONSE_MSG.USER.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateUser = async (req, res, next) => {
    try {
        let params = req.body;
        // Check user exists
        const user = await userService.detailUser(req.params.userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        params.user_id = req.params.userId;
        params.user_name = user.user_name;
        // Update user
        const result = await userService.updateUser(params);

        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.USER.UPDATE_FAILED));
        }

        return res.json(new SingleResponse(result, RESPONSE_MSG.USER.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Check user exists
        const user = await userService.detailUser(userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        // Delete user
        await userService.deleteUser(userId, req);

        return res.json(new SingleResponse(null, RESPONSE_MSG.USER.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailUser = async (req, res, next) => {
    try {
        const userId = req.body.auth_id;
        const username = req.body.auth_name;
        // Check user exists
        const user = await userService.detailUserV1(userId, username);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(new SingleResponse(user));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getById = async (req, res, next) => {
    try {
        const user = await userService.detailUserV1(req.params.userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(new SingleResponse(user));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const generateUsername = async (req, res, next) => {
    try {
        // Check user exists
        const user = await userService.generateUsername();

        return res.json(new SingleResponse(user, RESPONSE_MSG.USER.GENERATE_USERNAME_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const changePasswordUser = async (req, res, next) => {
    try {
        const userId = req.body.auth_id;

        // Check user exists
        const user = await userService.detailUser(userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        const hashpassword = await userService.checkPassword(userId);
        if (!stringHelper.comparePassword(req.body.old_password, hashpassword)) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, RESPONSE_MSG.USER.OLD_PASSWORD_WRONG));
        }
        // Update password of user
        await userService.changePasswordUser(userId, req.body.new_password, apiHelper.getAuthId(req));

        return res.json(new SingleResponse(null, RESPONSE_MSG.USER.UPDATE_PASSWORD_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

//============APP==========
const updateDeviceToken = async (req, res, next) => {
    try {
        const {device_token, auth_id: user_id, auth_name: user_name} = req.body;
        const result = await userService.logUserLogin({
            device_token,
            user_id,
            user_name,
            platform: 'mobile',
        });

        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.USER.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(result, RESPONSE_MSG.USER.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const {user_name} = req.body;

        // Check user exists
        const user = await userService.findByUserName(user_name);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // generate new password
        const newPassword = await userService.resetPassword(user);
        // push job send email: {newPassword, user}
        Queue.mail.add({
            type: 'send_mail',
            title: '[MINHLONG] Quên mật khẩu',
            template: 'forgot.password.html',
            to: user.email,
            params: {
                newPassword,
                fullName: user.full_name,
            },
        });
        return res.json(
            new SingleResponse(
                {
                    email: stringHelper.maskEmail(user.email),
                    newPassword,
                },
                RESPONSE_MSG.USER.RESET_PASSWORD_SUCCESS,
            ),
        );
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const onoffNotify = async (req, res, next) => {
    try {
        const user_name = req.body.auth_name;

        // Check user exists
        const onoffNotify = await userService.onoffNotify(user_name);

        // generate new password

        // push job send email: {newPassword, user}
        if (onoffNotify === 'OFFNOTIFY') {
            return res.json(
                new SingleResponse(
                    {
                        is_on: false,
                    },
                    'notify is off',
                ),
            );
        } else {
            return res.json(
                new SingleResponse(
                    {
                        is_on: true,
                    },
                    'notify is on',
                ),
            );
        }
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await userService.getOptions(req);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getHobbiesOptions = async (req, res, next) => {
    try {
        const serviceRes = await userService.getHobbiesOptions(req);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const updateHobbiesAndAboutMe = async (req, res, next) => {
    try {
        let params = req.body;
        // Check user exists
        const user = await userService.detailUser(req.params.userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        params.user_id = req.params.userId;
        params.user_name = user.user_name;
        const result = await userService.updateHobbiesAndAboutMe(params);

        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.USER.UPDATE_FAILED));
        }

        return res.json(new SingleResponse(result.getData(), result.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListUser,
    createUser,
    updateUser,
    deleteUser,
    detailUser,
    getById,
    resetPassword,
    changePasswordUser,
    generateUsername,
    getOptions,
    updateDeviceToken,
    onoffNotify,
    getHobbiesOptions,
    updateHobbiesAndAboutMe,
};
