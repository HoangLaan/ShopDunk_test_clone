const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const service = require('./installment-partner.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const create = async (req, res, next) => {
    try {
        const accountingPeriodRes = await service.createOrUpdate(req.body);
        if (accountingPeriodRes.isFailed()) {
            return next(accountingPeriodRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const update = async (req, res, next) => {
    try {
        const AccountingPeriodRes = await service.createOrUpdate(req.body);
        if (AccountingPeriodRes.isFailed()) {
            return next(AccountingPeriodRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteList = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteList(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detail = async (req, res, next) => {
    try {
        const serviceRes = await service.getDetail(req.params.installment_partner_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const genCode = async (req, res, next) => {
    try {
        const serviceRes = await service.genCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    create,
    update,
    deleteList,
    detail,
    genCode,
    getOptions,
};