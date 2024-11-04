const notifyService = require('./notify.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const sendSMS = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.sendSMS(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const sendAdv = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.sendAdv(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

//get with user, not red notify
const getListNotify = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.getListNotify(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

//update when user read notify
const updateReadNotify = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.updateReadNotify(Object.assign({}, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

//update when read all notify by user
const updateReadAllNotify = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.updateReadAllNotify(Object.assign({}, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    sendSMS,
    sendAdv,
    getListNotify,
    updateReadNotify,
    updateReadAllNotify,
};
