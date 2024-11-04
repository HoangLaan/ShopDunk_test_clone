const timekeepingService = require('./timekeeping.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const requestIp = require('request-ip');

const getShiftInfo = async (req, res, next) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        const { user_name } = req.auth;
        const serviceRes = await timekeepingService.getShiftInfo(user_name, clientIp);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const checkInOrCheckOut = async (req, res, next) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        const { user_name } = req.auth;
        const serviceRes = await timekeepingService.checkInOrCheckOut(clientIp, user_name, req.body);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStatiticsTimeKeeping = async (req, res, next) => {
    try {
        const { user_name } = req.auth;
        const serviceRes = await timekeepingService.getStatiticsTimeKeeping(user_name, req.query);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListTimeKeeping = async (req, res, next) => {
    try {
        const { user_name } = req.auth;
        const serviceRes = await timekeepingService.getListTimeKeeping(user_name, req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getShiftInfo,
    checkInOrCheckOut,
    getStatiticsTimeKeeping,
    getListTimeKeeping,
};
