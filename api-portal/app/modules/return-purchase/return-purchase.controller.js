const httpStatus = require('http-status');
const returnPurchaseService = require('./return-purchase.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const fs = require('fs');
const config = require('../../../config/config');

const getPurchaseOrdersOptions = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.getPurchaseOrdersOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductsOfPurchaseOrders = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.getProductsOfPurchaseOrders(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getStocksOptions = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.getStocksOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPurchaseOrdersDetail = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.getPurchaseOrdersDetail(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createInvoice = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.createInvoice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOrderInvoice = async (req, res, next) => {
    try {
        const serviceRes = await returnPurchaseService.getOrderInvoice(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getPurchaseOrdersOptions,
    getProductsOfPurchaseOrders,
    getStocksOptions,
    getPurchaseOrdersDetail,
    createInvoice,
    getOrderInvoice,
};
