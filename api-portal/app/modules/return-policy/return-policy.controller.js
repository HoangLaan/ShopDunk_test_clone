const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');

const apiHelper = require('../../common/helpers/api.helper');
const returnPolicyService = require('./return-policy.service');

const getReturnPolicyList = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getReturnPolicyList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createReturnPolicy = async (req, res, next) => {
    try {
        // Insert
        const serviceRes = await returnPolicyService.createOrUpdateReturnPolicy(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReturnPolicy = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await returnPolicyService.returnPolicyDetail(req.body.return_policy_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await returnPolicyService.createOrUpdateReturnPolicy(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteReturnPolicy = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await returnPolicyService.deleteReturnPolicy(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const returnPolicyDetail = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.returnPolicyDetail(req.params.id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getConditionList = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getConditionList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCustomerTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getCustomerTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new ListResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductCategoryList = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getProductCategoryList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getProductList = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getProductList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getCategoryOptions = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getCategoryOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getProductOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getReturnPolicyList,
    createReturnPolicy,
    updateReturnPolicy,
    deleteReturnPolicy,
    returnPolicyDetail,
    getConditionList,
    getCustomerTypeOptions,
    getProductCategoryList,
    getProductList,
    getCategoryOptions,
    getProductOptions,
};
