const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./mail-chimp.service');

const getListTransactionTemplate = async (req, res, next) => {
    try {
        const serviceRes = await service.getListTransactionalTemplate(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createTransactionTemplate = async (req, res, next) => {
    try {
        const serviceRes = await service.createTransactionTemplate(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendMailByTemplate = async (req, res, next) => {
    try {
        const serviceRes = await service.sendMailByTemplate(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendListMailByTemplate = async (req, res, next) => {
    try {
        const serviceRes = await service.sendListMail(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendListMailByTemplateToCustomerLeads = async (req, res, next) => {
    try {
        const serviceRes = await service.sendListMailToCustomerLeads(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendListMailByTemplateToMember = async (req, res, next) => {
    try {
        const serviceRes = await service.sendListMailToMember(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const sendOneMailByTemplate = async (req, res, next) => {
    try {
        const serviceRes = await service.sendOneMail(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getSenderInfo = async (req, res, next) => {
    try {
        const serviceRes = await service.getSenderInfo(req.body);

        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, serviceRes.message));
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'SUCCESS'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    createTransactionTemplate,
    sendMailByTemplate,
    sendListMailByTemplateToCustomerLeads,
    getListTransactionTemplate,
    sendListMailByTemplate,
    getSenderInfo,
    sendOneMailByTemplate,
    sendListMailByTemplateToMember,
};
