const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./cash-flow.service');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getCashFlowList = async (req, res, next) => {
    try {
        const serviceRes = await service.getCashFlowList(req.query);
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
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCashFlow = async (req, res, next) => {
    try {
        // Insert
        const serviceRes = await service.createOrUpdateCashFlow(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCashFlow = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await service.cashFlowDetail(req.body.cash_flow_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdateCashFlow(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * delete
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteCashFlow = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.deleteCashFlow(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const cashFlowDetail = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.cashFlowDetail(req.params.cash_flow_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcelCashFlow = async (req, res, next) => {
    try {
        let serviceRes = await service.exportExcelCashFlow(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        let data = serviceRes.getData();
        data.write('exportExcel.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const downloadTemplateCashFlow = async (req, res, next) => {
    try {
        let serviceRes = await service.downloadTemplateCashFlow(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        let data = serviceRes.getData();
        data.write('downloadTemplate.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const importExcelCashFlow = async (req, res, next) => {
    try {
        if (!Boolean(req.file))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));

        let serviceRes = await service.importExcelCashFlow(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getCashFlowList,
    createCashFlow,
    updateCashFlow,
    deleteCashFlow,
    cashFlowDetail,
    exportExcelCashFlow,
    downloadTemplateCashFlow,
    importExcelCashFlow,
};
