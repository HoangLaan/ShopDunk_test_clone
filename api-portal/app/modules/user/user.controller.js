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
const requestIP = require('request-ip');
const moment = require('moment');
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
        const users = await userService.getListUser(req);
        return res.json(new ListResponse(users['data'], users['total'], users['page'], users['limit']));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListUserShift = async (req, res, next) => {
    try {
        const users = await userService.getListUserByShift(req);
        return res.json(new ListResponse(users['data'], users['total'], users['page'], users['limit']));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListUserByOption = async (req, res, next) => {
    try {
        const users = await userService.getListUserByOption(req);
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
        // const userName = params.user_name;
        params.user_id = null;

        // Check email exists
        const emailExist = await userService.findByEmail(req.body.email);
        if (emailExist) {
            return next(new ValidationResponse('Email', 'đã tồn tại'));
        }

        // check phone number is existed ?
        // const isphoneNumberExisted = await userService.findByPhoneNumber(req.body.phone_number);
        // if (isphoneNumberExisted) {
        //     return next(new ValidationResponse('Số điện thoại', 'đã tồn tại'));
        // }

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
        const userID = req.params.userId;
        let params = req.body;
        // Check email exists
        const emailExist = await userService.findByEmail(req.body.email, userID);
        if (emailExist) {
            return next(new ValidationResponse('Email', 'đã tồn tại'));
        }

        // check phone number is existed ?
        // const isphoneNumberExisted = await userService.findByPhoneNumber(req.body.phone_number, userID);
        // if (isphoneNumberExisted) {
        //     return next(new ValidationResponse('Số điện thoại', 'đã tồn tại'));
        // }

        params.user_id = req.params.userId;

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
        // Delete user
        await userService.deleteUser(req);

        return res.json(new SingleResponse(null, RESPONSE_MSG.USER.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Check user exists
        const user = await userService.detailUser(userId);
        if (!user) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(new SingleResponse(user));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await userService.changePasswordUser(userId, req.body.password, apiHelper.getAuthId(req));

        return res.json(new SingleResponse(null, RESPONSE_MSG.USER.UPDATE_PASSWORD_SUCCESS));
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

// change password của chính user đó
const changePassword = async (req, res, next) => {
    try {
        const userId = req.body.auth_id;
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

// cho người có quyền mới có thể sửa
const changePasswordUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
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
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await userService.getOptionsAll({ ...req.query, ...req.body });
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserDivison = async (req, res, next) => {
    try {
        const users = await userService.getListUserDivison(req);

        return res.json(new ListResponse(users['data'], users['total'], users['page'], users['limit']));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const upload = async (req, res, next) => {
    try {
        if (!req.files) return new ErrorResponse(httpStatus.NOT_IMPLEMENTED, null, 'Tải lên không thành công');
        const file = req.files[0];
        return res.json(
            new SingleResponse({
                attachment_name: file.originalname,
                attachment_path: `/file/${file.filename}`,
            }),
        );
    } catch (error) {
        return next(error);
    }
};

const getListSkill = async (req, res, next) => {
    try {
        const serviceRes = await userService.getListSkill(req.query);
        if (!serviceRes) {
            return next(new ErrorResponse(httpStatus.NO_CONTENT, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(new SingleResponse(serviceRes));
    } catch (error) {
        return next(error);
    }
};

const getListSalaryHistory = async (req, res, next) => {
    try {
        const serviceRes = await userService.getListSalaryHistory({ ...req.params, ...req.query });
        if (!serviceRes) {
            return next(new ErrorResponse(httpStatus.NO_CONTENT, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(
            new ListResponse(serviceRes['data'], serviceRes['total'], serviceRes['page'], serviceRes['limit']),
        );
    } catch (error) {
        return next(error);
    }
};

const getListPositionHistory = async (req, res, next) => {
    try {
        const serviceRes = await userService.getListPositionHistory({ ...req.params, ...req.query });
        if (!serviceRes) {
            return next(new ErrorResponse(httpStatus.NO_CONTENT, null, RESPONSE_MSG.NOT_FOUND));
        }

        return res.json(
            new ListResponse(serviceRes['data'], serviceRes['total'], serviceRes['page'], serviceRes['limit']),
        );
    } catch (error) {
        return next(error);
    }
};

const getIpAddress = async (req, res, next) => {
    try {
        const ipAddress = requestIP.getClientIp(req);
        return res.json(
            new SingleResponse(
                {
                    ip: ipAddress,
                },
                'success',
            ),
        );
    } catch (error) {
        return next(error);
    }
};

const getShiftInfo = async (req, res, next) => {
    try {
        let serviceRes = await userService.getShiftInfo(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await userService.exportExcel(req);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write(`Danh_sach_nhan_vien_${moment().format('DD/MM/YYYY')}.xlsx`, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListUser,
    createUser,
    updateUser,
    deleteUser,
    detailUser,
    resetPassword,
    changePasswordUser,
    generateUsername,
    getOptions,
    getListUserDivison,
    upload,
    changePassword,
    getListSkill,
    getListSalaryHistory,
    getListPositionHistory,
    getShiftInfo,
    getIpAddress,
    exportExcel,
    getListUserByOption,
    getListUserShift
};