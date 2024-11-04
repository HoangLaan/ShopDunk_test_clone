const productModelService = require('./product-model.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionService = require('../../common/services/options.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.getListProductModel(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.detail(req.params.productModelId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createProductModel = async (req, res, next) => {
    try {
        req.body.model_id = null;
        const serviceRes = await productModelService.createProductModelOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const updateProductModel = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.createProductModelOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const deleteProductModel = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.deleteProductModel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_PRODUCTMODEL', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.exportExcel(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write('MODEL_SAN_PHAM.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const createAttribute = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.createAttribute(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getAttributeDetail = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.getAttributeDetail(req.params.product_attribute_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getAccountingAccountOptions = async (req, res, next) => {
    try {
        const serviceRes = await productModelService.getAccountingAccountOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    detail,
    createProductModel,
    updateProductModel,
    deleteProductModel,
    getOptions,
    exportExcel,
    createAttribute,
    getAttributeDetail,
    getAccountingAccountOptions,
};
