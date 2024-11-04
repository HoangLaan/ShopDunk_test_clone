const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const notifyService = require('./notify.service')

const getList = async (req, res, next) => {
    try {
        const serviceRes = await notifyService.getList(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
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
    getList,
    updateReadNotify,
    updateReadAllNotify
};