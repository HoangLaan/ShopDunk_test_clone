const httpStatus = require('http-status');
const sourceService = require('./source.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const optionService = require('../../common/services/options.service');

/**
 * Get list Source
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListSource = async (req, res, next) => {
    try {
        const resService = await sourceService.getList(req.query);
        if (resService.isFailed()) {
            return next(resService);
        }
        const {list, total} = resService.getData();
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Source
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createSource = async (req, res, next) => {
    try {
        const result = await sourceService.createOrUpdate(null, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Source
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateSource = async (req, res, next) => {
    try {
        req.body.updated_user = apiHelper.getAuthId(req);
        // Check Source exists
        const source = await sourceService.detail(req.params.id);
        if (source.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Source
        const result = await sourceService.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteSource = async (req, res, next) => {
    try {
        // Delete Source
        const serviceRes = await sourceService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailSource = async (req, res, next) => {
    try {
        // Check Source exists
        const source = await sourceService.detail(req.params.id);
        if (source.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(source.getData()));
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

module.exports = {
    getListSource,
    createSource,
    updateSource,
    deleteSource,
    detailSource,
    getOptions,
};
