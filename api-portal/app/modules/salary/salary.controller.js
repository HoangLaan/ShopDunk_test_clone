const SingleResponse = require('../../common/responses/single.response');
const salaryService = require('./salary.service');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list salary
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListSalary = async (req, res, next) => {
    try {
        const serviceRes = await salaryService.getListSalary(req.query);
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
const createSalary = async (req, res, next) => {
    try {
        // req.body.salary = null;
        const serviceRes = await salaryService.createOrUpdateSalary(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
/**
 * detail a salary
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailSalary = async (req, res, next) => {
    try {
        const serviceRes = await salaryService.detailSalary(req.params.salaryId);
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
const deleteSalary = async (req, res, next) => {
    try {
        const salaryId = req.params.salaryId;
        // Check
        const serviceResDetail = await salaryService.deleteSalary(salaryId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const UpdateSalary = async (req, res, next) => {
    try {
        const salaryId = req.params.salaryId;
        req.body.salary_id = salaryId;
        const serviceResDetail = await salaryService.detailSalary(salaryId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await salaryService.createOrUpdateSalary(req.body);
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
        const serviceRes = await salaryService.getOptions();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getListSalary,
    createSalary,
    UpdateSalary,
    deleteSalary,
    detailSalary,
    getOptions,
};
