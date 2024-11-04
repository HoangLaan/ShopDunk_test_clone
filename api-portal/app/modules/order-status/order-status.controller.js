const orderStatusService = require('./order-status.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListOrderStatus = async (req, res, next) => {
    try {
        const serviceRes = await orderStatusService.getListOrderStatus(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailOrderStatus = async (req, res, next) => {
    try {
        const serviceRes = await orderStatusService.detailOrderStatus(req.params.orderStatusId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create or Update
 */
const createOrUpdateOrderStatus = async (req, res, next) => {
    try {
        const serviceRes = await orderStatusService.createOrderStatusOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteOrderStatus = async (req, res, next) => {
    try {
        const orderStatusId = req.params.orderStatusId;

        const serviceRes = await orderStatusService.deleteOrderStatus(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get options
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await orderStatusService.getOptions();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


const getInformationWithOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderStatusService.getInformationWithOrder(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListOrderStatus,
    detailOrderStatus,
    createOrUpdateOrderStatus,
    deleteOrderStatus,
    getOptions,
    getInformationWithOrder
};
