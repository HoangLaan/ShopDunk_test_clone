const stocksInTypeService = require('./stocks-in-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKSINTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStocksInType = async (req, res, next) => {
    try {
        const serviceRes = await stocksInTypeService.getListStocksInType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailStocksInType = async (req, res, next) => {
    try {
        const serviceRes = await stocksInTypeService.detailStocksInType(req.params.stocksInTypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteStocksInType = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await stocksInTypeService.deleteStocksInType(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSINTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const createStocksInType = async (req, res, next) => {
    try {
        const serviceRes = await stocksInTypeService.createOrUpdateStocksInType(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINTYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updateStocksInType = async (req, res, next) => {
    try {
        const stocksInTypeId = req.params.stocksInTypeId;
        if (stocksInTypeId) {
            const stocksInTypeOptions = [
                'is_transfer',
                'is_purchase',
                'is_inventory_control',
                'is_exchange_goods',
                'is_warranty',
                'is_electronics_component',
                'is_internal',
            ];

            req.body = {
                ...req.body,
                // reset field `is_` get from detail to 0
                ...stocksInTypeOptions.reduce((a, v) => ({ ...a, [v]: 0 }), {}),
                // set new option update
                [stocksInTypeOptions[req.body.stocks_in_type]]: 1,
            };
        }

        const serviceRes = await stocksInTypeService.createOrUpdateStocksInType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINTYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptionsReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKSREVIEWLEVEL', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsReviewLevelIn = async (req, res, next) => {
    try {
        const serviceRes = await stocksInTypeService.getOptionsReviewLevelIn(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserReview = async (req, res, next) => {
    try {
        const serviceRes = await stocksInTypeService.getListUserReview(Object.assign(req.body, req.query));
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
    getListStocksInType,
    detailStocksInType,
    deleteStocksInType,
    createStocksInType,
    updateStocksInType,
    getOptionsReviewLevel,
    getListUserReview,
    getOptionsReviewLevelIn,
};
