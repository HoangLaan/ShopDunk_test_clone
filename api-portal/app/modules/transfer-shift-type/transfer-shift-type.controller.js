const httpStatus = require('http-status');
const transferShiftTypeService = require('./transfer-shift-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mkdirp = require('mkdirp-promise');
const formidable = require('formidable');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/transferShiftTypes`);
const fs = require('fs');
const apiConst = require('../../common/const/api.const');

/**
 * Get list Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListTransferShiftType = async (req, res, next) => {
    try {
        const { list, total } = await transferShiftTypeService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReviewLevel = async (req, res, next) => {
    try {
        const { list, total } = await transferShiftTypeService.getListReviewLevel(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDepartmentOptions = async (req, res, next) => {
    try {
        const data = await transferShiftTypeService.getDepartmentOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPositionOptions = async (req, res, next) => {
    try {
        const data = await transferShiftTypeService.getPositionOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getUserOptions = async (req, res, next) => {
    try {
        const data = await transferShiftTypeService.getUserOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCompanyOptions = async (req, res, next) => {
    try {
        const data = await transferShiftTypeService.getCompanyOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createTransferShiftType = async (req, res, next) => {
    try {
        const result = await transferShiftTypeService.createOrUpdate(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createReviewLevel = async (req, res, next) => {
    try {
        const result = await transferShiftTypeService.createReviewLevel(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateTransferShiftType = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const transferShiftType = await transferShiftTypeService.detail(req.params.id);
        if (!transferShiftType) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Task Work Flow
        req.body.id = req.params.id;
        const result = await transferShiftTypeService.createOrUpdate(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteTransferShiftType = async (req, res, next) => {
    try {
        // Delete Task Work Flow
        const serviceRes = await transferShiftTypeService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailTransferShiftType = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const transferShiftType = await transferShiftTypeService.detail(req.params.id);
        if (!transferShiftType) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(transferShiftType));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListTransferShiftType,
    createTransferShiftType,
    updateTransferShiftType,
    deleteTransferShiftType,
    detailTransferShiftType,

    getDepartmentOptions,
    getCompanyOptions,
    getPositionOptions,
    createReviewLevel,
    getListReviewLevel,
    getUserOptions,
};
