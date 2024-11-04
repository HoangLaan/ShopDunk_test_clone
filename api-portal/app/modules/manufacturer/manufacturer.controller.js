const manufacturerService = require('./manufacturer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list
 */
const getListManufacturer = async (req, res, next) => {
    try {
        const serviceRes = await manufacturerService.getListManufacturer(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailManufacturer = async (req, res, next) => {
    try {
        const manufacturerId = req.params.manufacturer_id;
        const serviceRes = await manufacturerService.detailManufacturer(manufacturerId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createManufacturer = async (req, res, next) => {
    try {
        req.body.manufacturer_id = null;
        const serviceRes = await manufacturerService.createManufacturerOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.MANUFACTURER.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateManufacturer = async (req, res, next) => {
    try {
        const manufacturerId = req.params.manufacturer_id;
        req.body.manufacturer_id = manufacturerId;

        // Check exists
        const serviceResDetail = await manufacturerService.detailManufacturer(manufacturerId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await manufacturerService.createManufacturerOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.MANUFACTURER.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusManufacturer = async (req, res, next) => {
    try {
        const manufacturerId = req.params.manufacturer_id;

        // Check exists
        const serviceResDetail = await manufacturerService.detailManufacturer(manufacturerId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update status
        await manufacturerService.changeStatusManufacturer(manufacturerId, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.MANUFACTURER.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete CRM_Manufacturer
 */
const deleteManufacturer = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await manufacturerService.deleteManufacturer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.MANUFACTURER.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list options Manufacturer
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_MANUFACTURER', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getListManufacturer,
    detailManufacturer,
    createManufacturer,
    updateManufacturer,
    changeStatusManufacturer,
    deleteManufacturer,
    getOptions,
};
