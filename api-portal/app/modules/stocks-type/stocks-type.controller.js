const stocksTypeService = require('./stocks-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list options stocksType
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKSTYPE', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list stocksType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTypeService.getListStocksType(req.query);
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
 * detail a stocksType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailStocksType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTypeService.detailStocksType(req.params.stocksTypeId);
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
const deleteStocksType = async (req, res, next) => {
    try {
        const stocksTypeId = req.params.stocksTypeId;
        // Check
        const serviceResDetail = await stocksTypeService.detailStocksType(stocksTypeId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await stocksTypeService.deleteStocksType(stocksTypeId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusStocksType = async (req, res, next) => {
    try {
        const stocksTypeId = req.params.stocksTypeId;
        const serviceResDetail = await stocksTypeService.detailStocksType(stocksTypeId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update status
        const serviceRes = await stocksTypeService.changeStatusStocksType(stocksTypeId, req.body);
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSTYPE.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createStocksType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTypeService.createOrUpdateStocksType(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSTYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateStocksType = async (req, res, next) => {
    try {
        const stocksTypeId = req.params.stocksTypeId;
        req.body.stocksTypeId = stocksTypeId;
        const serviceResDetail = await stocksTypeService.detailStocksType(stocksTypeId);

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await stocksTypeService.createOrUpdateStocksType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSTYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete list
 */
const deleteListStocksType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTypeService.deleteListStocksType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá danh sách loại kho thành công'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListStocksType,
    detailStocksType,
    deleteStocksType,
    changeStatusStocksType,
    createStocksType,
    updateStocksType,
    deleteListStocksType,
};
