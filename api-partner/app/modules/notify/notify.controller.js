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

const sendSMSVoucher = async (req, res, next) => {
    try {
        return res.json({ ok: true });
        // const serviceRes = await notifyService.sendSMSVoucher(req.body);
        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }
        // return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const sendSMSToSubscriber = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.sendSMSToSubscriber(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const sendZNSMiniGame = async (req, res, next) => {
    try {
        return res.json({ ok: true });
        // const serviceRes = await notifyService.sendZNSMiniGame(req.body);
        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }
        // return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    sendSMS,
    sendSMSVoucher,
    sendZNSMiniGame,
    sendSMSToSubscriber,
};
