const OffWorkTypeService = require('./offwork-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const getListOffWorkType = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getListOffWorkType(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createOffWorkType = async (req, res, next) => {
    try {
        //   req.body.campaign_id = null;
        const serviceRes = await OffWorkTypeService.createOffWorkType(req.body, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailOffWorkType = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.detailOffWorkType(req.params.offWorkTypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateOffWorkType = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.updateOffWorkType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteOffWorkType = async (req, res, next) => {
    try {
        // Check campaign exists
        const serviceRes = await OffWorkTypeService.deleteOffWorkType(req.query, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListOffWorkRlUser = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getListOffWorkRlUser(Object.assign({}, req.query, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsForCreate = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getOptionsForCreate(Object.assign({}, req.query, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsForUser = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getOptionsForUser(Object.assign({}, req.query, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOffWorkType,
    createOffWorkType,
    detailOffWorkType,
    updateOffWorkType,
    deleteOffWorkType,
    getListOffWorkRlUser,
    getOptionsForCreate,
    getOptionsForUser,
};
