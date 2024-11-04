const httpStatus = require('http-status');
const clusterService = require('./cluster.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const optionService = require('../../common/services/options.service');

/**
 * Get list Cluster
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCluster = async (req, res, next) => {
    try {
        const {list, total} = await clusterService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Cluster
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCluster = async (req, res, next) => {
    try {
        req.body.created_user = apiHelper.getAuthId(req);
        const result = await clusterService.create(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Cluster
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCluster = async (req, res, next) => {
    try {
        req.body.updated_user = apiHelper.getAuthId(req);
        // Check Cluster exists
        const functionGroup = await clusterService.detail(req.params.id);
        if (!functionGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Cluster
        const result = await clusterService.update(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteCluster = async (req, res, next) => {
    try {
        // Delete Cluster
        const serviceRes = await clusterService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailCluster = async (req, res, next) => {
    try {
        // Check Cluster exists
        const functionGroup = await clusterService.detail(req.params.id);
        if (!functionGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(functionGroup));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('AM_BUSINESS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStore = async (req, res, next) => {
    try {
        const {list, total} = await clusterService.getListStore(req.query);
        return res.json(new ListResponse(list, total));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getListCluster,
    createCluster,
    updateCluster,
    deleteCluster,
    detailCluster,
    getOptions,
    getListStore,
};
