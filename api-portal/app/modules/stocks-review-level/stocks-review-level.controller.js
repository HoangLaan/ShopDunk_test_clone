const stocksReviewLevelService = require('./stocks-review-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list options stocksReviewLevel
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKSREVIEWLEVEL', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list stocksReviewLevel
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksReviewLevelService.getListStocksReviewLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a stocksReviewLevel
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailStocksReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksReviewLevelService.detailStocksReviewLevel(req.params.stocksReviewLevelId);
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
const deleteStocksReviewLevel = async (req, res, next) => {
    try {
        const stocksReviewLevelId = req.params.stocksReviewLevelId;
        // Check
        const serviceResDetail = await stocksReviewLevelService.detailStocksReviewLevel(stocksReviewLevelId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await stocksReviewLevelService.deleteStocksReviewLevel(stocksReviewLevelId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusStocksReviewLevel = async (req, res, next) => {
    try {
        const stocksReviewLevelId = req.params.stocksReviewLevelId;
        const serviceResDetail = await stocksReviewLevelService.detailStocksReviewLevel(stocksReviewLevelId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update status
        const serviceRes = await stocksReviewLevelService.changeStatusStocksReviewLevel(stocksReviewLevelId, req.body);
        return res.json(
            new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS_REVIEW_LEVEL.CHANGE_STATUS_SUCCESS),
        );
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createStocksReviewLevel = async (req, res, next) => {
    try {
        req.body.stocksReviewLevel = null;
        const serviceRes = await stocksReviewLevelService.createOrUpdateStocksReviewLevel(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS_REVIEW_LEVEL.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateStocksReviewLevel = async (req, res, next) => {
    try {
        const stocksReviewLevelId = req.params.stocksReviewLevelId;
        req.body.stocksReviewLevelId = stocksReviewLevelId;
        const serviceResDetail = await stocksReviewLevelService.detailStocksReviewLevel(stocksReviewLevelId);

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await stocksReviewLevelService.createOrUpdateStocksReviewLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS_REVIEW_LEVEL.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptionsByType = async (req, res, next) => {
    try {
        let {type = 0} = req.params;
        const serviceRes = await stocksReviewLevelService.getOptionsByType(type);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListStocksReviewLevel,
    detailStocksReviewLevel,
    deleteStocksReviewLevel,
    changeStatusStocksReviewLevel,
    createStocksReviewLevel,
    updateStocksReviewLevel,
    getOptionsByType
};
