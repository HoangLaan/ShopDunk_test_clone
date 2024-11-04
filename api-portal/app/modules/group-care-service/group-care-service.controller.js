const groupCareService_Service = require('./group-care-service.service');
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

const getListGroupCareService = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await groupCareService_Service.getListGroupCareService(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getOptionsGroup = async (req, res, next) => {
    try {
        const serviceRes = await groupCareService_Service.optionGroupService(req.query);
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
        const serviceRes = await groupCareService_Service.getOptionsStockType(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStock = async (req, res, next) => {
    try {
        const serviceRes = await groupCareService_Service.getOptionsStock(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProduct = async (req, res, next) => {
    try {
        const serviceRes = await groupCareService_Service.getOptionsProduct(req.query);
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

const deleteGroupCareService = async (req, res, next) => {
    try {
        const serviceRes = await groupCareService_Service.deleteGroupCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createGroupCareService = async (req, res, next) => {
    try {
        // req.body.group_service_code = null;
        const serviceRes = await groupCareService_Service.createOrUpdateGroupCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const updateGroupCareService = async (req, res, next) => {
    try {
        const groupServiceCode = req.params.group_service_code;
        req.body.group_service_code = groupServiceCode;
        //Check exists
        const serviceResDetail = await groupCareService_Service.detailGroupCareService(groupServiceCode);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await groupCareService_Service.createOrUpdateGroupCareService(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const detailGroupCareService = async (req, res, next) => {
    try {
        const groupServiceCode = req.params.group_service_code;
        const serviceRes = await groupCareService_Service.detailGroupCareService(groupServiceCode);
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
        const serviceRes = await groupCareService_Service.exportExcel(req.query);

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
        const serviceRes = await groupCareService_Service.downloadExcel();
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

        let serviceRes = await groupCareService_Service.importExcel(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const generateGroupCode = async (req, res, next) => {
    try {
        var result = 'GS';
        let serviceRes = await groupCareService_Service.generateGroupCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const lastId = serviceRes?.getData().length > 0 ? serviceRes?.getData()[0].GROUPSERVICEID + "" : "1";
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

module.exports = {
    getListGroupCareService,
    getOptionsGroup,
    getOptionsOrigin,
    getOptionsManufacture,
    getOptionsStock,
    getOptionsStockType,
    getOptionsStore,
    detailGroupCareService,
    createGroupCareService,
    updateGroupCareService,
    getOptionsArea,
    getOptionsBusiness,
    getOptionsOutputType,
    exportExcel,
    downloadExcel,
    importExcel,
    getOptionsProduct,
    deleteGroupCareService,
    generateGroupCode
};
