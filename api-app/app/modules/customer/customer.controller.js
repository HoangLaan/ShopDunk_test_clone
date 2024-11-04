const customerService = require('./customer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');

/**
 * Get list customer
 */
const getListCustomer = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getListCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCustomerPersonal = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getListCustomerPersonal(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createOrUpdateCustomer = async (req, res, next) => {
    try {
        const serviceRes = await customerService.createOrUpdateCustomer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Tạo mới khách hàng thành công'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDetail = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getDetail(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPurchaseHistory = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getPurchaseHistory(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTaskHistory = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getTaskHistory(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getSourceOptions = async (req, res, next) => {
    try {
        const serviceRes = await customerService.getSourceOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListCustomer,
    createOrUpdateCustomer,
    getListCustomerPersonal,
    getDetail,
    getPurchaseHistory,
    getTaskHistory,
    getSourceOptions,
};
