const returnConditionService = require('./return-condition.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { log } = require('handlebars');

/**
 * Get list
 */
const getListReturnCondition = async (req, res, next) => {
    try {
        const { list, total } = await returnConditionService.getListReturnCondition(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a exchange
 */
const createExchange = async (req, res, next) => {
    try {
        const serviceRes = await returnConditionService.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update exchange
 */
const updateExchange = async (req, res, next) => {
    try {
        const serviceRes = await returnConditionService.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Delete exchange
 */
const deleteExchange = async (req, res, next) => {
    try {
        const returnConditionId = req.params.id;
        // Check Exchange exists
        const serviceResDetail = await returnConditionService.getById(returnConditionId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // req.body.deleted_user = req.auth.user_name;
        // Delete Exchange
        const serviceRes = await returnConditionService.deleteExchange(returnConditionId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Delete list
 */
const deleteListExchange = async (req, res, next) => {
    try {
        const serviceRes = await returnConditionService.deleteListExchange(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá kinh nghiệm thành công'));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const serviceRes = await returnConditionService.getById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListReturnCondition,
    createExchange,
    getById,
    updateExchange,
    deleteExchange,
    deleteListExchange,
};
