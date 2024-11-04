const stocksDetailService = require('./stocks-detail.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');

/**
 * Get list options stocksDetail
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
 * Get list geStocksOptions
 */
const geStocksOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKS', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list stocksDetail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksDetail = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListStocksDetail(Object.assign(req.body, req.query));
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
 * detail a stocksDetail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailStocksDetail = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.detailStocksDetail(req.params.stocksId, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProductImeiCode = async (req, res, next) => {
    try {
        req.query.product_id = req.params.product_id;
        const serviceRes = await stocksDetailService.getListProductImeiCode(req.query);
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
 * Delete
 */
const deleteStocksDetail = async (req, res, next) => {
    try {
        const stocksProductHoldingId = req.params.stocksProductHoldingId;
        // Delete
        const serviceRes = await stocksDetailService.deleteStocksDetail(stocksProductHoldingId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKS_DETAIL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
const getUnitList = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getUnitList(req.params);
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
 * Get list stocksDetail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListProductImeiStocksOut = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListProductImeiStocksOut(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// search for stocks detail
const getListProductImeiCodeStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListProductImeiCodeStocks(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, total_inventory, total_cost_price, total_cost_basic_imei_code } =
            serviceRes.getData();
        let result = {
            items: data,
            itemsPerPage: limit,
            page,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            total_inventory,
            total_cost_price,
            total_cost_basic_imei_code,
        };

        return res.json(new SingleResponse(result));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListExchangeQty = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListExchangeQty(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getOptionsUserImport = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getOptionsUserImport(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getListRequestByProductImeiCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListRequestByProductImeiCode(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getOptionsProduct = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getOptionsProduct(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProductImeiToDivide = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListProductImeiToDivide(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get list stocksDetail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksDetailForReport = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListStocksDetailForReport(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // const {data, total, page, limit} = serviceRes.getData();
        // return res.json(new ListResponse(data, total, page, limit));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcelInventory = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.exportExcelInventory(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        const wb = serviceRes.getData();
        wb.write('REPORT_TASK.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getListIMEI = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getListIMEI(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const calculateOutStocks = async (req, res, next) => {
    try {
        const services = await stocksDetailService.calculateOutStocks({ ...req.params, ...req.body });
        if (services.isFailed()) {
            return next(services);
        }
        return res.json(new SingleResponse(services.getData(), services.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getLastCalculateDate = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getLastCalculateDate();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdateCogsSettings = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.createOrUpdateCogsSettings(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCogsSettings = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getCogsSettings();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.getStocksOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await stocksDetailService.exportExcelStock(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        const wb = serviceRes.getData();
        wb.write('DS_Ton_Kho.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListStocksDetail,
    detailStocksDetail,
    geStocksOptions,
    getListProductImeiCode,
    deleteStocksDetail,
    getUnitList,
    getListProductImeiStocksOut,
    getListProductImeiCodeStocks,
    getListExchangeQty,
    getOptionsUserImport,
    getListRequestByProductImeiCode,
    getOptionsProduct,
    getListProductImeiToDivide,
    getListStocksDetailForReport,
    exportExcelInventory,
    getListIMEI,
    calculateOutStocks,
    getLastCalculateDate,
    createOrUpdateCogsSettings,
    getCogsSettings,
    getStocksOptions,
    exportExcel,
};
