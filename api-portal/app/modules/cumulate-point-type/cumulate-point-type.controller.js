const httpStatus = require('http-status');
const service = require('./cumulate-point-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCumulatePoinType = async (req, res, next) => {
    try {
        const result = await service.getList({ ...req.query, ...req.body });
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total, page, itemsPerPage } = result.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListStore = async (req, res, next) => {
    try {
        const result = await service.getListStore({ ...req.query, ...req.body });
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCumulatePoinType = async (req, res, next) => {
    try {
        const result = await service.createOrUpdate(null, req.body);
        if (result.isFailed()) {
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

const updateCumulatePoinType = async (req, res, next) => {
    try {
        // Check  exists
        const data = await service.detail(req.params.id);
        if (data.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update
        const result = await service.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteCumulatePoinType = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailCumulatePoinType = async (req, res, next) => {
    try {
        const result = await service.detail({ id: req.params.id, ...req.body });
        if (result.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListOptions = async (req, res, next) => {
    try {
        const result = await service.getListOptions(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const calculatePoint = async (req, res, next) => {
    try {
        const result = await service.calculatePoint(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListCumulatePoinType,
    createCumulatePoinType,
    updateCumulatePoinType,
    deleteCumulatePoinType,
    detailCumulatePoinType,
    getListStore,
    getListOptions,
    calculatePoint,
};
