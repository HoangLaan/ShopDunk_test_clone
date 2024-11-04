const productCategoryService = require('./product-category.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionService = require('../../common/services/options.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.getListProductCategory(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.detail(req.params.productCategoryId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createProductCategory = async (req, res, next) => {
    try {
        req.body.product_category_id = null;
        const serviceRes = await productCategoryService.createProductCategoryOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const updateProductCategory = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.createProductCategoryOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const deleteProductCategory = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.deleteProductCategory(req.body);
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
        const serviceRes = await optionService('MD_PRODUCTCATEGORY_OPTS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionTreeview = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.getOptionTreeview(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.exportExcel(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write('DANH_MUC_SAN_PHAM.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getListAttributes = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.getListAttributes(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createAttribute = async (req, res, next) => {
    try {
        const serviceRes = await productCategoryService.createAttribute(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsAttribute = async (req, res, next) => {
    try {
        const { productCategoryId } = req.params;
        const serviceRes = await productCategoryService.getOptionsAttribute(productCategoryId);
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProductModel = async (req, res, next) => {
    try {
        const { productCategoryId } = req.params;
        const serviceRes = await productCategoryService.getOptionsProductModel(productCategoryId, req.query);
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getMaterialById = async (req, res, next) => {
    try {
        const { material_id } = req.params;
        const serviceRes = await productCategoryService.getMaterialById(material_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    detail,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getOptions,
    getOptionTreeview,
    exportExcel,
    getListAttributes,
    createAttribute,
    getOptionsAttribute,
    getOptionsProductModel,
    getMaterialById,
};
