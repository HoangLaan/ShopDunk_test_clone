const httpStatus = require('http-status');
const reportService = require('./report.service');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getList = async (req, res, next) => {
    try {
        const businessIds = Array.isArray(req.query?.business_id) ? req.query?.business_id : null;
        const storeIds = Array.isArray(req.query?.store_id) ? req.query?.store_id : null;
        const productIds = Array.isArray(req.query?.product_id) ? req.query?.product_id : null;
        const accountIds = Array.isArray(req.query?.account_id) ? req.query?.account_id : null;

        const serviceRes = await reportService.getList(
            Object.assign({}, req.query, req.body, businessIds, storeIds, productIds, accountIds));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, statistic, total_money } = serviceRes.getData();
        let response = new ListResponse(data, total, page, limit, total_money);
        if (statistic) {
            response.setData({ statistic });
        }
        return res.json(response);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

//export excel
const exportExcel = async (req, res, next) => {
    try {
        const businessIds = Array.isArray(req.query?.business_id) ? req.query?.business_id : null;
        const storeIds = Array.isArray(req.query?.store_id) ? req.query?.store_id : null;
        const productIds = Array.isArray(req.query?.product_id) ? req.query?.product_id : null;
        const accountIds = Array.isArray(req.query?.account_id) ? req.query?.account_id : null;

        const serviceRes = await reportService.exportExcel(
            Object.assign({}, req.query, req.body, businessIds, storeIds, productIds, accountIds
        ))

        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        
        const wb = serviceRes.getData();
        wb.write('So_ban_hang.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

//export excelAccouting
const exportExcelAccounting = async (req, res, next) => {
    try {
        const businessIds = Array.isArray(req.query?.business_id) ? req.query?.business_id : null;
        const storeIds = Array.isArray(req.query?.store_id) ? req.query?.store_id : null;
        const productIds = Array.isArray(req.query?.product_id) ? req.query?.product_id : null;
        const accountIds = Array.isArray(req.query?.account_id) ? req.query?.account_id : null;

        const serviceRes = await reportService.exportExcelAccounting(
            Object.assign({}, req.query, req.body, businessIds, storeIds, productIds, accountIds
        ))

        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        
        const wb = serviceRes.getData();
        wb.write('So_ban_hang.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListAccounting = async (req, res, next) => {
    try {
        const businessIds = Array.isArray(req.query?.business_id) ? req.query?.business_id : null;
        const storeIds = Array.isArray(req.query?.store_id) ? req.query?.store_id : null;
        const productIds = Array.isArray(req.query?.product_id) ? req.query?.product_id : null;
        const accountIds = Array.isArray(req.query?.account_id) ? req.query?.account_id : null;

        const serviceRes = await reportService.getListAccounting(
            Object.assign({}, req.query, req.body, businessIds, storeIds, productIds, accountIds));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, statistic, total_money } = serviceRes.getData();
        let response = new ListResponse(data, total, page, limit, total_money);
        if (statistic) {
            response.setData({ statistic });
        }
        return res.json(response);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getList,
    getListAccounting,
    exportExcel,
    exportExcelAccounting
};