const service = require('./regime-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListRegimeType = async (req, res, next) => {
    try {
        const serviceRes = await service.getListRegimeType(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteRegimeType = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteRegimeType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.EXPEND_TYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailRegimeType = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.detailRegimeType(req.params.regime_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a
 */
const createRegimeType = async (req, res, next) => {
    try {
        req.body.regime_type_id = null;
        const serviceRes = await service.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.EXPEND_TYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a
 */
const updateRegimeType = async (req, res, next) => {
    try {
        const regime_type_id = req.params.regime_type_id;
        req.body.regime_type_id = regime_type_id;

        // Check exists
        const serviceResDetail = await service.detailRegimeType(regime_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.EXPEND_TYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getUserOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getUserOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getDepartmentOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getDepartmentOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getPositionOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getPositionOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getReviewLevelList = async (req, res, next) => {
    try {
        const serviceRes = await service.getReviewLevelList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await service.createReviewLevel(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.EXPEND_TYPE.REVIEW_LEVEL.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteReviewLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.EXPEND_TYPE.REVIEW_LEVEL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListRegimeType,
    deleteRegimeType,
    detailRegimeType,
    createRegimeType,
    updateRegimeType,
    getUserOptions,
    getDepartmentOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getPositionOptions,
};
