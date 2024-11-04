const httpStatus = require('http-status');
const transferShiftService = require('./transfer-shift.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const optionService = require('../../common/services/options.service');

/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getList({...req.query, auth_name: req.body.auth_name});
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {list, total, page, itemsPerPage} = serviceRes.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const create = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.createOrUpdate(null, req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const update = async (req, res, next) => {
    try {
        // Check  exists
        const resDetail = await transferShiftService.detail(req.params.id);
        if (resDetail.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update
        const result = await transferShiftService.createOrUpdate(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detail = async (req, res, next) => {
    try {
        // Check  exists
        const serviceRes = await transferShiftService.detail(req.params.id);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.updateReview(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getReviewInformation = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getReviewInformation({
            ...req.query,
            auth_name: req.body.auth_name,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getShift = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getShift({...req.query, auth_name: req.body.auth_name});
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListTransferShiftType = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getListTransferShiftType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReview = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getListReview(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getStore = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getStore(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getBusiness = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getBusiness();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReviewByUser = async (req, res, next) => {
    try {
        const serviceRes = await transferShiftService.getListReviewByUser({
            ...req.query,
            auth_name: req.body.auth_name,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {list, total, page, itemsPerPage} = serviceRes.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getList,
    create,
    update,
    detail,
    updateReview,
    getReviewInformation,
    getShift,
    getListTransferShiftType,
    getListReview,
    getStore,
    getBusiness,
    getListReviewByUser,
};
