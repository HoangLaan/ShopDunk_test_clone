const stocksTakeRequestService = require('./stocks-take-request.service.js');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const SingleResponse = require('../../common/responses/single.response');
const httpStatus = require('http-status');

/**
 * getListStocksOutType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksOutType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.getListStocksTakeRequest(req.query);
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
 * createStocksTakeRequest
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const createStocksTakeRequest = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.createStocksTakeRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Thêm mới phiếu kiểm kê thành công'));
    } catch (error) {
        return next(error);
    }
};

/**
 * getUserOfDepartmentOpts
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getUserOfDepartmentOpts = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.getUserOfDepartmentOpts(Object.assign(req.query, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * generate stocks take request code
 *
 * @param _
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const generateStocksTakeRequestCode = async (_, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.generateStocksTakeRequestCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * detail a stocksInRequest
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const detailStocksTakeRequest = async (req, res, next) => {
    try {
        const id = req.params?.stocks_take_request_id;
        const serviceRes = await stocksTakeRequestService.getDetailStocksTakeRequest(id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.getListProduct(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListProductInventory = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.getTotalInventoryWithId(Object.assign(req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const executeStocksTakeRequestPeriod = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.executeStocksTakeRequestPeriod(
            Object.assign({}, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'Xử lý tồn kho thành công'));
    } catch (error) {
        return next(error);
    }
};

const approveOrRejectUpdateStocksTake = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.approveOrRejectUpdateStocksTake(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updateConcludeContent = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.updateConcludeContent(Object.assign(req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const productStocksTakeImport = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.productStocksTakeImport(req.body, req.files);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getStocksById = async (req, res, next) => {
    try {
        const serviceRes = await stocksTakeRequestService.getStocksById(req.params?.store_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteStocksTakeRequestPeriod = async (req, res, next) => {
    try {
        const stocks_take_request_id = req.params.stocks_take_request_id;
        // Delete
        const serviceRes =
            await stocksTakeRequestService.deleteStocksTakeRequestPeriod(
                stocks_take_request_id,
                req.body
            );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(
                null,
                RESPONSE_MSG.STOCKSTAKEREQUESTPERIOD.DELETE_SUCCESS
            )
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListStocksOutType,
    getUserOfDepartmentOpts,
    generateStocksTakeRequestCode,
    createStocksTakeRequest,
    detailStocksTakeRequest,
    getListProduct,
    getListProductInventory,
    executeStocksTakeRequestPeriod,
    approveOrRejectUpdateStocksTake,
    productStocksTakeImport,
    updateConcludeContent,
    getStocksById,
    deleteStocksTakeRequestPeriod
};
