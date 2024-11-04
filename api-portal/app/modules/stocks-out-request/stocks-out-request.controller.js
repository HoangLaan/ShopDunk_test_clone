const httpStatus = require('http-status');
const stocksOutRequestService = require('./stocks-out-request.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const fs = require('fs');
const config = require('../../../config/config');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getList(Object.assign(req.body,req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListUnit = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListUnit(req.query);
        return res.json(new SingleResponse(serviceRes));
    } catch (error) {
        return next(error);
    }
};

const getListOutputType = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListOutputType(req.query);
        return res.json(new SingleResponse(serviceRes));
    } catch (error) {
        return next(error);
    }
};

const getListStocksOutType = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListStocksOutType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListDetail = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListDetail(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getMaxId = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getMaxId(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail
 *
 */
const detailStocksOutRequest = async (req, res, next) => {
    try {
        const stocks_out_request_id = req.params.stocks_out_request_id;

        // Check exists
        const serviceRes = await stocksOutRequestService.detailStocksOutRequest(stocks_out_request_id);
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
const createStocksOutRequest = async (req, res, next) => {
    try {
        req.body.stocks_out_request_id = null;
        const serviceRes = await stocksOutRequestService.createStocksOutRequestOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createStocksOutRequestDetail = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.createStocksOutRequestOrUpdateDetail(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update
 */
const updateStocksOutRequest = async (req, res, next) => {
    try {
        const stocks_out_request_id = req.params.stocks_out_request_id;
        req.body.stocks_out_request_id = stocks_out_request_id;
        // Check segment exists
        const serviceResDetail = await stocksOutRequestService.detailStocksOutRequest(stocks_out_request_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update segment
        const serviceRes = await stocksOutRequestService.createStocksOutRequestOrUpdate(req.body, true);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * delete
 *
 */
const deleteStocksOutRequest = async (req, res, next) => {
    try {
        const stocks_out_request_id = req.params.stocks_out_request_id;

        // Check
        const serviceResDetail = await stocksOutRequestService.detailStocksOutRequest(stocks_out_request_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await stocksOutRequestService.deleteStocksOutRequest(stocks_out_request_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTREQUEST.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsStocks
 */
const getOptsStocks = async (req, res, next) => {
    try {
        // const serviceRes = await optionService('ST_STOCKS', req.query);
        // return res.json(new SingleResponse(serviceRes.getData()));
        const serviceRes = await stocksOutRequestService.getOptsStocks(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen genDataByStocksOutTypeId
 */
const genDataByStocksOutTypeId = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.genDataByStocksOutTypeId(req.params.stocks_out_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksManager = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getStocksManager(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCustomer = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTotalInventoryImei = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getTotalInventoryImei({ ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getVehicleList = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getVehicleList(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDriverList = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getDriverList(req.params);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPhoneNumber = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getPhoneNumber(req.params.driver_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const stocksOutRequestGenCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.stocksOutRequestGenCode({
            ...req.params,
            ...req.body,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsProductCode
 */
const getOptsProductCode = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_PRODUCT_CODE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Gen genProductName
 */
const genProductName = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.genProductName(req.params.product_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductUnitDensityList = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getProductUnitDensityList(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getUnitList = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getUnitList(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPriceCost = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getPriceCost(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.exportPDF(req.params.stocks_out_request_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const data = serviceRes?.getData()?.path;
        return res.json(new SingleResponse(data));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const exportTransportPDF = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.exportTransportPDF(req.params.stocks_out_request_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const data = serviceRes?.getData()?.path;
        return res.json(new SingleResponse(data));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

/**
 * Get detail
 */
const detailToPrint = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.detailToPrint(req.params.stocksOutRequestId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get list getListDescription
 */
const getListDescription = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SYS_APPCONFIG_STOCKSOUTREQUEST', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createPartnerTransport = async (req, res, next) => {
    try {
        req.body.stocksOutRequest = null;
        const serviceRes = await stocksOutRequestService.createPartnerTransport(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.CREATE_PARTNER_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getProductOptions(Object.assign(req.body, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksData = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getStocksData(Object.assign(req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReviewLevelByStocksOutypeId = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListReviewLevelByStocksOutypeId(
            Object.assign(req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('XUAT_KHO.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getListCustomerDeboune = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListCustomerDeboune(
            Object.assign(req.body, req.params, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCreatedUserDebune = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getListCreatedUserDebune(
            Object.assign(req.body, req.params, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * delete
 *
 */
const approveOrRejectUpdateStocksout = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.approveOrRejectUpdateStocksout(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const stocksOutputed = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.stocksOutputed(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteListStocksOut = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.deleteListStocksOut(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá phiếu xuất kho thành công'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsOrders = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getOptionsOrders(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportPDFByOrder = async (req, res, next) => {
    try {
        const services = await stocksOutRequestService.exportPDFByOrder({ ...req.params, ...req.body });
        if (services.isFailed()) {
            return next(services);
        }
        return res.json(new SingleResponse(services.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductByImei = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getProductByImei({ ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createStocksoutRequestByOrderID = async (req, res, next) => {
    try {
        const services = await stocksOutRequestService.createStocksoutRequestByOrderID({ ...req.params, ...req.body });
        if (services.isFailed()) {
            return next(services);
        }
        return res.json(new SingleResponse(services.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getStocksOutRequestByOrder = async (req, res, next) => {
    try {
        const serviceRes = await stocksOutRequestService.getStocksOutRequestByOrder(Object.assign(req.body,req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getMaxId,
    getList,
    detailStocksOutRequest,
    getListUnit,
    getListOutputType,
    getListStocksOutType,
    getListDetail,
    createStocksOutRequest,
    createStocksOutRequestDetail,
    updateStocksOutRequest,
    deleteStocksOutRequest,
    getOptsStocks,
    genDataByStocksOutTypeId,
    getStocksManager,
    getListCustomer,
    getListCustomerDeboune,
    getVehicleList,
    getDriverList,
    getPhoneNumber,
    stocksOutRequestGenCode,
    getOptsProductCode,
    genProductName,
    getProductUnitDensityList,
    getUnitList,
    getPriceCost,
    exportPDF,
    detailToPrint,
    getListDescription,
    createPartnerTransport,
    getProductOptions,
    getStocksData,
    exportExcel,
    getTotalInventoryImei,
    getListReviewLevelByStocksOutypeId,
    approveOrRejectUpdateStocksout,
    stocksOutputed,
    getListCreatedUserDebune,
    deleteListStocksOut,
    getOptionsOrders,
    exportPDFByOrder,
    getProductByImei,
    exportTransportPDF,
    createStocksoutRequestByOrderID,
    getProductByImei,
    getStocksOutRequestByOrder,
};
