const priceReviewLevelService = require('./price-review-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list PriceReviewLevel
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListPriceReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await priceReviewLevelService.getListPriceReviewLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a PriceReviewLevel
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailPriceReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await priceReviewLevelService.detailPriceReviewLevel(req.params.price_review_level_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deletePriceReviewLevel = async (req, res, next) => {
    try {
        // Delete

        const serviceRes = await priceReviewLevelService.deletePriceReviewLevel(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.PRICEREVIEWLEVEL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createPriceReviewLevel = async (req, res, next) => {
    try {
        req.body.PriceReviewLevel = null;
        const serviceRes = await priceReviewLevelService.createOrUpdatePriceReviewLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRICEREVIEWLEVEL.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
// getOptions
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await priceReviewLevelService.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceResDetail);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getListPriceReviewLevel,
    detailPriceReviewLevel,
    deletePriceReviewLevel,
    createPriceReviewLevel,
    getOptions,
};
