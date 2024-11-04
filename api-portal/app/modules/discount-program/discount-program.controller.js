const service = require('./discount-program.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list PO_PROGRAM
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getListDiscountProgram(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDiscountProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getDiscountProducts(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStatiticDiscountProgram = async (req, res, next) => {
    try {
        const serviceRes = await service.getStatiticDiscountProgram(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a PO_PROGRAM
 */
const createDiscountProgram = async (req, res, next) => {
    try {
        req.body.discount_program_id = req.params?.discount_program_id;
        const serviceRes = await service.createDiscountProgramOrUpdates(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTION.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail PO_PROGRAM
 */
const detail = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await service.detail(req.params.discount_program_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete discount program
 */
const deleteDiscountProgram = async (req, res, next) => {
    try {
        const list_id = apiHelper.getValueFromObject(req.body, 'list_id', []);
        if (list_id?.length > 0) {
            for (let i = 0; i < list_id.length; i++) {
                // Check discount program exists
                const parseIdPromotion = parseInt(list_id[i]);
                const serviceResDetail = await service.detail(parseIdPromotion);
                if (serviceResDetail.isFailed()) {
                    return next(serviceResDetail);
                }
            }
        }

        // Delete discount program
        const serviceRes = await service.deleteDiscountProgram(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.PO_DISCOUNTPROGRAM.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const approveReview = async (req, res, next) => {
    try {
        const serviceRes = await service.approveReview(req.params.discount_program_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.PO_DISCOUNTPROGRAM.APPROVE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    getStatiticDiscountProgram,
    createDiscountProgram,
    detail,
    deleteDiscountProgram,
    getOptions,
    getDiscountProduct,
    approveReview,
};
