const service = require('./expend-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListExpendType = async (req, res, next) => {
    try {
        const serviceRes = await service.getListExpendType(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListBankAccount = async (req, res, next) => {
    try {
        const serviceRes = await service.getListBankAccount(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteExpendType = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteExpendType(req.body);
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
const detailExpendType = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.detailExpendType(req.params.expend_type_id);
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
const createExpendType = async (req, res, next) => {
    try {
        req.body.expend_type_id = null;
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
const updateExpendType = async (req, res, next) => {
    try {
        const expend_type_id = req.params.expend_type_id;
        req.body.expend_type_id = expend_type_id;

        // Check exists
        const serviceResDetail = await service.detailExpendType(expend_type_id);
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

const getExpendTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getExpendTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getCompanyOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getCompanyOptions(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getBusinessOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getBusinessOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
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
    getListExpendType,
    deleteExpendType,
    detailExpendType,
    createExpendType,
    updateExpendType,
    getExpendTypeOptions,
    getCompanyOptions,
    getBusinessOptions,
    getUserOptions,
    getDepartmentOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getPositionOptions,
    getListBankAccount,
};
