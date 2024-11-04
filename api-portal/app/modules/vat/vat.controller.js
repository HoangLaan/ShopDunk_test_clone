const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');

const vatService = require('./vat.service');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
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
        const serviceRes = await optionService('MD_VAT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get list Origin
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListVat = async (req, res, next) => {
    try {
        const serviceRes = await vatService.getListVat(req.query);
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
 * Create
 */
const createOrUpdateVat = async (req, res, next) => {
    try {
        req.body.Origin = null;
        const serviceRes = await vatService.createOrUpdateVat(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
/**
 * detail a Origin
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailVat = async (req, res, next) => {
    try {
        const serviceRes = await vatService.detailVat(req.params.vatId);
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
const deleteVat = async (req, res, next) => {
    try {
        const vatId = req.params.vatId;
        // Check
        const serviceResDetail = await vatService.deleteVat(vatId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getOptions,
    getListVat,
    createOrUpdateVat,
    deleteVat,
    detailVat,
};
