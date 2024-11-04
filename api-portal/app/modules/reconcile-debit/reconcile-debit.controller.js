const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const service = require('./reconcile-debit.service');

const loadData = async (req, res, next) => {
    try {
        const serviceRes = await service.loadData(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListHistory = async (req, res, next) => {
    try {
        const serviceRes = await service.getListHistory(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const executeReconcile = async (req, res, next) => {
    try {
        const result = await service.executeReconcile(req.body);
        if (result.isFailed()) {
            return next(result);
        }

        return res.json(new SingleResponse(result.getData(), RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const revertReconcile = async (req, res, next) => {
    try {
        const result = await service.revertReconcile(req.body);
        if (result.isFailed()) {
            return next(result);
        }

        return res.json(new SingleResponse(result.getData(), RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    executeReconcile,
    loadData,
    getListHistory,
    revertReconcile,
};
