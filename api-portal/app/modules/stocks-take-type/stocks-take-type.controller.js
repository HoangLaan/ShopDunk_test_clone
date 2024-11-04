const stocksTakeTypeService = require('./stocks-take-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/* Get list function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.getOptionsStocksTakeType(Object.assign(req.body, req.query));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStocksTakeType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.getListStocksTakeType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailStocksTakeTypeForTake = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.detailStocksTakeTypeForTake(Object.assign(req.params, req.query));
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
const deleteStocksTakeType = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await stocksTakeTypeService.deleteStocksTakeType(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSTAKETYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const createStocksTakeType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.createOrUpdateStocksTakeType(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSTAKETYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateStocksTakeType = async (req, res, next) => {
    try {
        const stocksTakeTypeId = req.params.stocksTakeTypeId;
        req.body.stocksTakeTypeId = stocksTakeTypeId;
        const serviceResDetail = await stocksTakeTypeService.detailStocksTakeType(stocksTakeTypeId);

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await stocksTakeTypeService.createOrUpdateStocksTakeType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSTAKETYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('STOCKSTAKETYPE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getOptionsReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.getOptionsReviewLevel(Object.assign(req.body, req.query));
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
        const serviceRes = await stocksTakeTypeService.getListUserReview(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailStocksTakeType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeTypeService.detailStocksTakeType(req.params.stocksTakeTypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getListStocksTakeType,
    detailStocksTakeTypeForTake,
    deleteStocksTakeType,
    createStocksTakeType,
    updateStocksTakeType,
    exportExcel,
    getListUserReview,
    getOptionsReviewLevel,
    getOptions,
    detailStocksTakeType
};
