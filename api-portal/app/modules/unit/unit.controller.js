const unitService = require('./unit.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/* Get list function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_UNIT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list unit
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListUnit = async (req, res, next) => {
    try {
        const serviceRes = await unitService.getListUnit(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a unit
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailUnit = async (req, res, next) => {
    try {
        const serviceRes = await unitService.detailUnit(req.params.unitId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteUnit = async (req, res, next) => {
    try {
        const unitId = req.params.unitId;
        // Check
        const serviceResDetail = await unitService.detailUnit(unitId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await unitService.deleteUnit(unitId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.UNIT.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusUnit = async (req, res, next) => {
    try {
        const unitId = req.params.unitId;
        const serviceResDetail = await unitService.detailUnit(unitId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update status
        const serviceRes = await unitService.changeStatusUnit(unitId, req.body);
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UNIT.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createUnit = async (req, res, next) => {
    try {
        req.body.unit = null;
        const serviceRes = await unitService.createOrUpdateUnit(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UNIT.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateUnit = async (req, res, next) => {
    try {
        const unitId = req.params.unitId;
        req.body.unitId = unitId;
        const serviceResDetail = await unitService.detailUnit(unitId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await unitService.createOrUpdateUnit(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UNIT.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListUnit,
    detailUnit,
    deleteUnit,
    changeStatusUnit,
    createUnit,
    updateUnit,
};
