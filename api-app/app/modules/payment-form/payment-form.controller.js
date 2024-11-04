const service = require('./payment-form.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');

/**
 * Get list by store
 */
const getListByStore = async (req, res, next) => {
    try {
        const serviceRes = await service.getListByStore(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getConfigPaymentForm = async (req, res, next) => {
    try {
        const serviceRes = await service.getConfigPaymentForm(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListByStore,
    getConfigPaymentForm
};
