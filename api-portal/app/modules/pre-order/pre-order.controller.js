const preOrderService = require('./pre-order.service');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');

const getCustomerHisBuyIphone = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.getCustomerHisBuyIphone(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCustomerHisBuyIphone15 = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.getCustomerHisBuyIphone15(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getInterestCustomer = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.getInterestCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, meta } = serviceRes.getData();
        const listRes = new ListResponse(data, total, page, limit);
        listRes.data.meta = meta;
        return res.json(listRes);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await preOrderService.exportExcel(Object.assign(req.body, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write('customer.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getCustomerHisBuyIphone,
    getInterestCustomer,
    getCustomerHisBuyIphone15,
    exportExcel,
};
