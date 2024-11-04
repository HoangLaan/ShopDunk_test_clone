const httpStatus = require('http-status');
const functionGroupService = require('./functionGroup.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const optionService = require('../../common/services/options.service');

/**
 * Get list Function Group
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListFunctionGroup = async (req, res, next) => {
    try {
        const {list, total} = await functionGroupService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Function Group
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createFunctionGroup = async (req, res, next) => {
    try {
        req.body.created_user = apiHelper.getAuthId(req);
        const checkName = await functionGroupService.checkName(req.body.function_group_name);
        if (!checkName) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTIONGROUP.CHECK_NAME_FAILED));
        }
        const result = await functionGroupService.create(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Function Group
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateFunctionGroup = async (req, res, next) => {
    try {
        req.body.updated_user = apiHelper.getAuthId(req);
        // Check Function Group exists
        const functionGroup = await functionGroupService.detail(req.params.id);
        if (!functionGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        const checkName = await functionGroupService.checkName(req.body.function_group_name, req.params.id);
        if (!checkName) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTIONGROUP.CHECK_NAME_FAILED));
        }
        // Update Function Group
        const result = await functionGroupService.update(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteFunctionGroup = async (req, res, next) => {
    try {
        // Delete Function Group
        const serviceRes = await functionGroupService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailFunctionGroup = async (req, res, next) => {
    try {
        // Check Function Group exists
        const functionGroup = await functionGroupService.detail(req.params.id);
        if (!functionGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(functionGroup));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateStatus = async (req, res, next) => {
    try {
        req.body.updated_user = apiHelper.getAuthId(req);
        // Check Function Group exists
        const functionGroup = await functionGroupService.detail(req.params.id);
        if (!functionGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Status
        const result = await functionGroupService.updateStatus(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SYS_FUNCTIONGROUP', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListFunctionGroup,
    createFunctionGroup,
    updateFunctionGroup,
    deleteFunctionGroup,
    detailFunctionGroup,
    updateStatus,
    getOptions,
};
