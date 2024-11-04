const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./misa-invoice.service');

const getTemplates = async (req, res, next) => {
    try {
        const serviceRes = await service.getTemplates(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const publishHSM = async (req, res, next) => {
    try {
        const serviceRes = await service.publishingWithHSM(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const publishTransportHSM = async (req, res, next) => {
    try {
        const serviceRes = await service.publishTransportHSM(
            req.body,
            req.params.stocks_out_request_id,
            req.query.stocks_id,
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const viewDemo = async (req, res, next) => {
    try {
        const serviceRes = await service.viewDemoInvoice(req.body, req.query.store_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const viewDemoStocksOut = async (req, res, next) => {
    try {
        const serviceRes = await service.viewDemoStocksOut(req.body, req.query.stocks_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getInvoiceByRefId = async (req, res, next) => {
    try {
        const serviceRes = await service.getInvoiceByRefId(req.params?.orderno);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const viewInvoiceByTransactionId = async (req, res, next) => {
    try {
        const serviceRes = await service.viewInvoiceByTransactionId(req.params?.transaction_id, req.query.auth_name);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendMailToCustomer = async (req, res, next) => {
    try {
        const serviceRes = await service.sendInvoiceToCustomer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const cancelInvoice = async (req, res, next) => {
    try {
        const serviceRes = await service.cancelInvoice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const dowloadInvoice = async (req, res, next) => {
    try {
        const serviceRes = await service.dowloadInvoice(req.params?.transaction_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getTemplates,
    publishHSM,
    getInvoiceByRefId,
    viewInvoiceByTransactionId,
    sendMailToCustomer,
    cancelInvoice,
    dowloadInvoice,
    viewDemo,
    viewDemoStocksOut,
    publishTransportHSM,
};
