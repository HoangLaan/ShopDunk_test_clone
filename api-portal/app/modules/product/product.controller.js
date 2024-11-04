const productService = require('./product.service');
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

const getListProduct = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await productService.getListProduct(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
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
        const serviceRes = await productService.getOptionsStockType(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStock = async (req, res, next) => {
    try {
        const serviceRes = await productService.getOptionsStock(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProduct = async (req, res, next) => {
    try {
        const serviceRes = await productService.getOptionsProduct(req.query);
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

const deleteProduct = async (req, res, next) => {
    try {
        const serviceRes = await productService.deleteProduct(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getListAttributes = async (req, res, next) => {
    try {
        const serviceRes = await productService.getListAttributes(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createAttribute = async (req, res, next) => {
    try {
        const serviceRes = await productService.createAttribute(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        req.body.product_id = null;
        const serviceRes = await productService.createProductOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.product_id;
        req.body.product_id = productId;

        // Check exists
        const serviceResDetail = await productService.detailProduct(productId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await productService.createProductOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const detailProduct = async (req, res, next) => {
    try {
        const productId = req.params.product_id;
        const serviceRes = await productService.detailProduct(productId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductsPrintBarcode = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await productService.getProductsPrintBarcode(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const printBarcode = async (req, res, next) => {
    try {
        const serviceRes = await productService.printBarcode(req.body);
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
        const serviceRes = await productService.exportExcel(req.query);

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
        const serviceRes = await productService.downloadExcel();
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

        let serviceRes = await productService.importExcel(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const printQROrBarcode = async (req, res, next) => {
    try {
        const serviceRes = await productService.printQROrBarcode(req.body);
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

const getStockInRequest = async (req, res, next) => {
    try {
        const serviceRes = await productService.getStockInRequest(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListProduct,
    getOptionsUnit,
    getOptionsOrigin,
    getOptionsManufacture,
    getOptionsStock,
    getOptionsStockType,
    getOptionsStore,
    getListAttributes,
    deleteProduct,
    createAttribute,
    detailProduct,
    createProduct,
    updateProduct,
    getOptionsArea,
    getOptionsBusiness,
    getOptionsOutputType,
    getProductsPrintBarcode,
    printBarcode,
    exportExcel,
    downloadExcel,
    importExcel,
    printQROrBarcode,
    getManufacturerOptions,
    getOptionsProduct,
    getStockInRequest,
};
