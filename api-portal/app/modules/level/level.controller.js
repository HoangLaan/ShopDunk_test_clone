const SingleResponse = require('../../common/responses/single.response');

const levelService = require('./level.service');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list Level
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListLevel = async (req, res, next) => {
    try {
        const serviceRes = await levelService.getListLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
/**
 * Create
 */
const createLevel = async (req, res, next) => {
    try {
        // req.body.Level = null;
        const serviceRes = await levelService.createOrUpdateLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
/**
 * detail a Level
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailLevel = async (req, res, next) => {
    try {
        const serviceRes = await levelService.detailLevel(req.params.levelId);
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
const deleteLevel = async (req, res, next) => {
    try {
        const levelId = req.params.levelId;
        // Check
        const serviceResDetail = await levelService.deleteLevel(levelId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updateLevel = async (req, res, next) => {
    try {
        const levelId = req.params.levelId;
        req.body.level_id = levelId;
        const serviceResDetail = await levelService.detailLevel(levelId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await levelService.createOrUpdateLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TOPIC.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await levelService.getOptions();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getListLevel,
    createLevel,
    updateLevel,
    deleteLevel,
    detailLevel,
    getOptions,
};
