const preOrderService = require('./pre-order.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { notification } = require('../../common/services/bullmq.service');
const NOTIFY_CONST = require('../../common/const/notify.const');
const httpStatus = require('http-status');
const _ = require('lodash');


const createReceislipOrder = async (req, res, next) => {
    try {
        req.body.pre_order_id = req.params.preOrderId;
        const serviceRes = await preOrderService.createReceislipOrder(req);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};


const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.exportPDF(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOrderIdByPreorderId = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.getOrderIdByPreorderId(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateSignature = async (req, res, next) => {
    try {

        let serviceRes = await preOrderService.updateSignature(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const checkProductBoughtByPhoneNumber = async (req, res, next) => {
    try {

        let serviceRes = await preOrderService.checkProductBoughtByPhoneNumber(Object.assign({}, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createReceislipOrder,
    exportPDF,
    getOrderIdByPreorderId,
    updateSignature,
    checkProductBoughtByPhoneNumber,
}
