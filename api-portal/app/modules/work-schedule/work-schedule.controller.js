const service = require('./work-schedule.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const config = require('../../../config/config');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const serviceRes = await service.createOrUpdate(JSON.parse(req.body.data), req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse([]));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const update = async (req, res, next) => {
    try {
        req.body.work_schedule_id = req.params.work_schedule_id;
        const serviceRes = await service.createOrUpdate(JSON.parse(req.body.data), req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse([]));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const getListReview = async (req, res, next) => {
    try {
        const serviceRes = await service.getListReview(req.query);
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const serviceRes = await service.detail(req.params.work_schedule_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteWorkSchedule = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteWorkSchedule(req.params.work_schedule_id, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await service.updateReviewLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        console.log(error);
    }
};

const getOrderApply = async (req, res, next) => {
    try {
        const serviceRes = await service.getOrderApply(req.query);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    create,
    getListReview,
    detail,
    update,
    deleteWorkSchedule,
    updateReviewLevel,
    getOrderApply,
};
