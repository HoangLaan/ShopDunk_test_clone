const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const service = require('./stocks.service');

const getListStockInRequest = async (req, res, next) => {
    try {
        const params = Object.assign({},req.body,req.query, req.auth)
        const serviceRes = await service.getListStockInRequest(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const getDetailStockInRequest = async (req, res, next) => {
    try {
        const params = Object.assign({} ,req.params,req.body,req.query, req.auth)
        const serviceRes = await service.getDetailStockInRequest(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};
const getListStockInProductImei = async (req, res, next) => {
    try {
        const params = Object.assign({}, req.params,req.body,req.query, req.auth)
        const serviceRes = await service.getListStockInProductImei(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const addStockInProductImei = async (req, res, next) => {
    try {
        const params = Object.assign({} ,req.params,req.body,req.query, req.auth)
        const serviceRes = await service.addStockInProductImei(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const importStock = async (req, res, next) => {
    try {
        const params = Object.assign({} ,req.params,req.body,req.query, req.auth)
        const serviceRes = await service.importStock(params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getListStockInRequest,
    getDetailStockInRequest,
    getListStockInProductImei,
    addStockInProductImei,
    importStock
};
