const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const ListResponse = require('../../common/responses/list.response');
const ShiftService = require('./shift.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
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
        const serviceRes = await optionService('MD_SHIFT', req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListShift = async (req, res, next) => {
    try {
        const serviceRes = await ShiftService.getListShift(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createShift = async (req, res, next) => {
    try {
        const serviceRes = await ShiftService.createOrUpdateShift(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDetailShift = async (req, res, next) => {
    try {
        const shift_id = req.params.shift_id;
        const serviceRes = await ShiftService.getDetailShift(shift_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateShift = async (req, res, next) => {
    try {
        const shift_id = req.params.shift_id;
        const serviceResDetal = await ShiftService.getDetailShift(shift_id);
        if (serviceResDetal.isFailed()) {
            return next(serviceResDetal);
        }
        req.body.shift_id = shift_id;
        const serviceRes = await ShiftService.createOrUpdateShift(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deteleShift = async (req, res, next) => {
    try {
        const shift_id = req.params.shift_id;
        const serviceRes = await ShiftService.deleteShift(shift_id, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        // return next(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const gencode = async (req, res, next) => {
    try {
        const serviceRes = await ShiftService.gencode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getStoreList = async (req, res, next) => {
    try {
        const serviceRes = await ShiftService.getStoreList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getOptions,
    createShift,
    updateShift,
    getListShift,
    getDetailShift,
    deteleShift,
    gencode,
    getStoreList,
};
