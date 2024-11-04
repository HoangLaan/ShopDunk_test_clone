const httpStatus = require('http-status');
const stocksService = require('./stocks.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const ValidationResponse = require('../../common/responses/validation.response');
// const optionService = require('../../common/services/options.service');
// const apiHelper = require('../../common/helpers/api.helper');

/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStocks(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListStocksType = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStocksType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCompany = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListCompany(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListManufacturer = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListManufacturer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListStockManager = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStockManager(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListBusinessByCompanyID = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListBusinessByCompanyID(req.query);
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
 * detail
 *
 */
const detailStocks = async (req, res, next) => {
    try {
        const stocks_id = req.params.stocks_id;

        // Check exists
        const serviceRes = await stocksService.detailStocks(stocks_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create
 */
const createStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.createStocksOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create
 */
const createStocksStocksManager = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.createStocksOrUpdateStocksManager(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update
 */
const updateStocks = async (req, res, next) => {
    try {
        const stocks_id = req.params.stocks_id;
        req.body.stocks_id = stocks_id;

        // Check segment exists
        const serviceResDetail = await stocksService.detailStocks(stocks_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update segment
        const serviceRes = await stocksService.createStocksOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * delete
 *
 */
const deleteStocks = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await stocksService.deleteStocks(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteStocksStocksManager = async (req, res, next) => {
    try {
        const stocks_manager_id = req.params.stocks_manager_id;

        // Delete
        const serviceRes = await stocksService.deleteStocksStocksManager(stocks_manager_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStoreOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStoreOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStocksTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStocksTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserByStoreIdOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListUserByStoreIdOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStocksByStore = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getOptionsStocksByStore(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStoreOptionsByParams = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getListStoreOptionsByParams(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStocksByStoreBusiness = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.getOptionsStocksByStoreBusiness(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const checkBelongsToBusiness = async (req, res, next) => {
    try {
        const serviceRes = await stocksService.checkBelongsToBusiness(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListStocks,
    getListStocksType,
    getListCompany,
    getListManufacturer,
    getListStockManager,
    getListBusinessByCompanyID,
    detailStocks,
    createStocks,
    createStocksStocksManager,
    updateStocks,
    deleteStocks,
    deleteStocksStocksManager,
    getOptions,
    getListStoreOptions,
    getListStocksTypeOptions,
    getListUserByStoreIdOptions,
    getOptionsStocksByStore,
    getListStoreOptionsByParams,
    getOptionsStocksByStoreBusiness,
    checkBelongsToBusiness,
};
