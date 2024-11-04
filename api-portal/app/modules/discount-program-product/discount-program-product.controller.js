const httpStatus = require('http-status');
const discountProgramProductService = require('./discount-program-product.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mkdirp = require('mkdirp-promise');
const formidable = require('formidable');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/discountProgramProducts`);
const fs = require('fs');
const apiConst = require('../../common/const/api.const');

const getListDiscountProgramProduct = async (req, res, next) => {
    try {
        const { list, total, sum } = await discountProgramProductService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage, { sum }));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDetailProduct = async (req, res, next) => {
    try {
        const resService = await discountProgramProductService.getDetailProduct(req.query);
        if (resService.isFailed()) {
            return next(resService);
        }
        return res.json(new SingleResponse(resService.getData(), resService.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getManufacturerOptions = async (req, res, next) => {
    try {
        const resService = await discountProgramProductService.getManufacturerOptions(req.query);
        if (resService.isFailed()) {
            return next(resService);
        }
        return res.json(new SingleResponse(resService.getData(), resService.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        req.query.itemsPerPage = apiConst.MAX_EXPORT_EXCEL;
        const serviceRq = await discountProgramProductService.exportExcel(req.query);
        if (serviceRq.isFailed()) {
            return next(serviceRq);
        }
        const wb = serviceRq.getData();
        wb.write('DiscountProgramProduct.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.NOT_FOUND));
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const resService = await discountProgramProductService.getProductOptions(req.query);
        if (resService.isFailed()) {
            return next(resService);
        }
        return res.json(new SingleResponse(resService.getData(), resService.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListDiscountProgramProduct,
    exportExcel,
    getManufacturerOptions,
    getProductOptions,
    getDetailProduct,
};
