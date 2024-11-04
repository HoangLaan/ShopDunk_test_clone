const productAttributeService = require('./product-attribute.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list
 */
const getListProductAttribute = async (req, res, next) => {
    try {
        const serviceRes = await productAttributeService.getListProductAttribute(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createProductAttribute = async (req, res, next) => {
    try {
        const serviceRes = await productAttributeService.createProductAttributeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCTATTRIBUTE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateProductAttribute = async (req, res, next) => {
    try {
        const product_attribute_id = req.params.product_attribute_id;
        req.body.product_attribute_id = product_attribute_id;

        // Check exists
        const serviceResDetail = await productAttributeService.detailProductAttribute(product_attribute_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await productAttributeService.createProductAttributeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCTATTRIBUTE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get detail
 */
const detailProductAttribute = async (req, res, next) => {
    try {
        const product_attribute_id = req.params.product_attribute_id;
        const serviceRes = await productAttributeService.detailProductAttribute(product_attribute_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusProductAttribute = async (req, res, next) => {
    try {
        const product_attribute_id = req.params.product_attribute_id;
        // Check exists
        const serviceResDetail = await productAttributeService.detailProductAttribute(product_attribute_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update status
        await productAttributeService.changeStatusProductAttribute(product_attribute_id, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCTATTRIBUTE.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteProductAttribute = async (req, res, next) => {
    try {
        const product_attribute_id = req.params.product_attribute_id;
        // Check exists
        const serviceResDetail = await productAttributeService.detailProductAttribute(product_attribute_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await productAttributeService.deleteProductAttribute(product_attribute_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCTATTRIBUTE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await productAttributeService.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListProductAttribute,
    createProductAttribute,
    updateProductAttribute,
    detailProductAttribute,
    changeStatusProductAttribute,
    deleteProductAttribute,
    getOptions,
};
