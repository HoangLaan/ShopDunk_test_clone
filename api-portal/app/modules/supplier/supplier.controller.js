const supplierService = require('./supplier.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_SUPPLIER
 */
const getListSupplier = async (req, res, next) => {
    try {
        const serviceRes = await supplierService.getListSupplier(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteSupplier = async (req, res, next) => {
    try {
        // Check supplier exists
        // const serviceResDetail = await storeService.detailStore(storeId);
        // if(serviceResDetail.isFailed()) {
        //   return next(serviceResDetail);
        // }

        // Delete area
        const serviceRes = await supplierService.deleteSupplier(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.SUPPLIER.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail MD_SUPPLIER
 */
const detailSupplier = async (req, res, next) => {
    try {
        // Check Supplier exists
        const serviceRes = await supplierService.detailSupplier(req.params.supplier_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const changeStatusSupplier = async (req, res, next) => {
    try {
        const supplier_id = req.params.supplier_id;

        // Check supplier exists
        // const serviceResDetail = await supplierService.detailSupplier(supplier_id);
        // if(serviceResDetail.isFailed()) {
        //   return next(serviceResDetail);
        // }

        // Update status
        await supplierService.changeStatusSupplier(supplier_id, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.SUPPLIER.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a MD_SUPPLIER
 */
const createSupplier = async (req, res, next) => {
    try {
        req.body.supplier_id = null;
        const serviceRes = await supplierService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SUPPLIER.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a MD_SUPPLIER
 */
const updateSupplier = async (req, res, next) => {
    try {
        const supplier_id = req.params.supplier_id;
        req.body.supplier_id = supplier_id;

        // Check supplier exists
        const serviceResDetail = await supplierService.detailSupplier(supplier_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update supplier
        const serviceRes = await supplierService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SUPPLIER.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list options supplier
 */

const getOptions = async (req, res, next) => {
    try {
        req.body.supplier_id = null;
        const serviceRes = await supplierService.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListSupplier,
    deleteSupplier,
    detailSupplier,
    changeStatusSupplier,
    createSupplier,
    updateSupplier,
    getOptions,
};
