const orderTypeService = require('./order-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListOrderType = async (req, res, next) => {
    try {
        const serviceRes = await orderTypeService.getListOrderType(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailOrderType = async (req, res, next) => {
    try {
        const serviceRes = await orderTypeService.detailOrderType(req.params.orderTypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createOrderType = async (req, res, next) => {
    try {
        req.body.order_status_id = null;
        const serviceRes = await orderTypeService.createOrderTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateOrderType = async (req, res, next) => {
    try {
        const orderTypeId = req.params.orderTypeId;
        req.body.order_status_id = orderTypeId;

        const serviceResDetail = await orderTypeService.detailOrderType(orderTypeId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await orderTypeService.createOrderTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteOrderType = async (req, res, next) => {
    try {
        const serviceRes = await orderTypeService.deleteOrderType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOrderType,
    detailOrderType,
    createOrderType,
    updateOrderType,
    deleteOrderType,
};
