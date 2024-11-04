const service = require('./payment.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');

const listenVNPayIPN = async (req, res, next) => {
    try {
        const serviceRes = await service.listenVNPayIPN(req.body);
        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }
        return res.json(new SingleResponse(true));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const listenOnePayIPN = async (req, res, next) => {
    try {
        const serviceRes = await service.listenOnePayIPN(req.body);
        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }
        return res.json(new SingleResponse(true));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const paymentOrder = async (req, res, next) => {
    try {
        req.body.order_id = req.params.orderId;
        const serviceRes = await service.paymentOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const saveTransactionVCBPOS = async (req, res, next) => {
    try {
        const params = Object.assign({},req.body,req.query, {order_id: req.params.orderId})
        const serviceRes = await service.saveTransactionVCBPOS(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const saveTransactionVNPayPOS = async (req, res, next) => {
    try {
        const params = Object.assign({},req.body,req.query, {order_id: req.params.orderId})
        const serviceRes = await service.saveTransactionVNPayPOS(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    listenVNPayIPN,
    listenOnePayIPN,
    paymentOrder,
    saveTransactionVCBPOS,
    saveTransactionVNPayPOS
};
