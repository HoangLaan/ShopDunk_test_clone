const httpStatus = require('http-status');
const equipmentGroupService = require('./equipmentGroup.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const optionService = require('../../common/services/options.service');
const logger = require('../../common/classes/logger.class');

/**
 * Get list Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListEquipmentGroup = async (req, res, next) => {
    try {
        const { list, total } = await equipmentGroupService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createEquipmentGroup = async (req, res, next) => {
    try {
        const result = await equipmentGroupService.createOrUpdateHandler(req.body);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateEquipmentGroup = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const equipmentGroup = await equipmentGroupService.detail(req.params.id);
        if (!equipmentGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Task Work Flow
        const serviceRes = await equipmentGroupService.createOrUpdateHandler(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DEGREE.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptionsEquipmentGroup = async (req, res, next) => {
    try {
        const serviceRes = await equipmentGroupService.getGroupOptions();
        return res.json(new ListResponse(Object.values(serviceRes)));
    } catch (error) {
        logger.error(error.message, 'equipmentGroup.getOptionsEquipmentGroup');
        return next(error);
    }
};

const deleteEquipmentGroup = async (req, res, next) => {
    try {
        // Delete Task Work Flow
        const serviceRes = await equipmentGroupService.remove(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailEquipmentGroup = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const equipmentGroup = await equipmentGroupService.detail(req.params.id);
        if (!equipmentGroup) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(equipmentGroup));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListEquipmentGroup,
    createEquipmentGroup,
    updateEquipmentGroup,
    deleteEquipmentGroup,
    detailEquipmentGroup,
    getOptionsEquipmentGroup,
};
