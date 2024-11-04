const stocksTransferTypeService = require('./stocks-transfer-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');
const optionService = require('../../common/services/options.service');

const getListStocksTransferType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferTypeService.getListStocksTransferType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const delStocksTransferType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferTypeService.delStocksTransferType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Success'));
    } catch (error) {
        return next(error);
    }
};

const getSocksTransferTypeById = async (req, res, next) => {
    try {
        let {id = 0} = req.params
        const serviceRes = await stocksTransferTypeService.getSocksTransferTypeById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdateStocksTransferType = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferTypeService.createOrUpdateStocksTransferType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Thêm mới/Cập nhật hình thức luân chuyển kho thành công.'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferTypeService.getOptionsReviewLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferTypeService.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListStocksTransferType,
    delStocksTransferType,
    getSocksTransferTypeById,
    createOrUpdateStocksTransferType,
    getOptionsReviewLevel,
    getOptions
}