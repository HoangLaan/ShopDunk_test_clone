const httpStatus = require('http-status');
const workScheduleTypeService = require('./work-schedule-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mkdirp = require('mkdirp-promise');
const formidable = require('formidable');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/workScheduleTypes`);
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
const getListWorkScheduleType = async (req, res, next) => {
    try {
        const { list, total } = await workScheduleTypeService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReviewLevel = async (req, res, next) => {
    try {
        const { list, total } = await workScheduleTypeService.getListReviewLevel(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDepartmentOptions = async (req, res, next) => {
    try {
        const data = await workScheduleTypeService.getDepartmentOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPositionOptions = async (req, res, next) => {
    try {
        const data = await workScheduleTypeService.getPositionOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getUserOptions = async (req, res, next) => {
    try {
        const data = await workScheduleTypeService.getUserOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCompanyOptions = async (req, res, next) => {
    try {
        const data = await workScheduleTypeService.getCompanyOptions(req.query);
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
const createWorkScheduleType = async (req, res, next) => {
    try {
        const result = await workScheduleTypeService.createOrUpdate(req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, result.message));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createReviewLevel = async (req, res, next) => {
    try {
        const result = await workScheduleTypeService.createReviewLevel(req.body);
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
const updateWorkScheduleType = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const workScheduleType = await workScheduleTypeService.detail(req.params.id);
        if (!workScheduleType) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Task Work Flow
        req.body.id = req.params.id;
        const result = await workScheduleTypeService.createOrUpdate(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteWorkScheduleType = async (req, res, next) => {
    try {
        // Delete Task Work Flow
        const serviceRes = await workScheduleTypeService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailWorkScheduleType = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const workScheduleType = await workScheduleTypeService.detail(req.params.id);
        if (!workScheduleType) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(workScheduleType));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListWorkScheduleType,
    createWorkScheduleType,
    updateWorkScheduleType,
    deleteWorkScheduleType,
    detailWorkScheduleType,

    getDepartmentOptions,
    getCompanyOptions,
    getPositionOptions,
    createReviewLevel,
    getListReviewLevel,
    getUserOptions,
};
