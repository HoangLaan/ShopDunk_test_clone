const careService_Service = require('./care-service.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');

const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/products`);
const formidable = require('formidable');
const mkdirp = require('mkdirp-promise');
const fs = require('fs');

const getListCareService = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await careService_Service.getListCareService(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const generateCareCode = async (req, res, next) => {
    try {
        var result = 'CS';
        let serviceRes = await careService_Service.generateCareCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const lastId = serviceRes?.getData().length > 0 ? serviceRes?.getData()[0].CARESERVICEID + "" : "1";
        var lengthLastId = lastId.length;
        if (lengthLastId < 6) {
            var addZeroNumber = 6 - lengthLastId;
            for (var i = 0; i < addZeroNumber; i++) {
                result = result + '0';
            }
            result = result + lastId;
        }
        return res.json(new SingleResponse(result));
    } catch (error) {
        return next(error);
    }
};

const getOptionsGroup = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.optionGroupService(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await careService_Service.getListProduct(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};


const getOptionsPeriod = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.optionGroupPeriod(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


const getOptionsUnit = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_UNIT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsOrigin = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_ORIGIN', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStore = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_STORE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStockType = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.getOptionsStockType(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStock = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.getOptionsStock(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProduct = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.getOptionsProduct(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsManufacture = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_MANUFACTURER', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsArea = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_AREA', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsOutputType = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_OUTPUTTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsBusiness = async (req, res, next) => {
    try {
        const serviceRes = await optionService('AM_BUSINESS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteCareService = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.deleteCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createCareService = async (req, res, next) => {
    try {
        req.body.care_service_id = null;
        const serviceRes = await careService_Service.createOrUpdateCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const updateCareService = async (req, res, next) => {
    try {
        const careServiceCode = req.params.care_service_code;
        req.body.care_service_code = careServiceCode;

        // Check exists
        const serviceResDetail = await careService_Service.detailCareService(careServiceCode);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await careService_Service.createOrUpdateCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const detailCareService = async (req, res, next) => {
    try {
        const careServiceCode = req.params.care_service_code;
        const serviceRes = await careService_Service.detailCareService(careServiceCode);
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
        const serviceRes = await careService_Service.exportExcel(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write('PRODUCT.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const downloadExcel = async (req, res, next) => {
    try {
        const serviceRes = await careService_Service.downloadExcel();
        const wb = serviceRes.getData();
        wb.write('PRODUCTIMPORTTEMPALTE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!Boolean(req.file))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));

        let serviceRes = await careService_Service.importExcel(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getManufacturerOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_MANUFACTURER', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListProduct,
    getOptionsPeriod,
    getOptionsGroup,
    getListCareService,
    generateCareCode,
    getOptionsUnit,
    getOptionsOrigin,
    getOptionsManufacture,
    getOptionsStock,
    getOptionsStockType,
    getOptionsStore,
    deleteCareService,
    detailCareService,
    createCareService,
    updateCareService,
    getOptionsArea,
    getOptionsBusiness,
    getOptionsOutputType,
    exportExcel,
    downloadExcel,
    importExcel,
    getManufacturerOptions,
    getOptionsProduct,
};
