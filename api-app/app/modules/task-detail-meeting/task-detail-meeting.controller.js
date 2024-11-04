const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const taskDetailService = require('./task-detail-meeting.service');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await taskDetailService.getList({...req.body, ...req.query});
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const serviceRes = await taskDetailService.detail(req.params);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListTaskWorkFlow = async (req, res, next) => {
    try {
        const serviceRes = await taskDetailService.getListTaskWorkFlow(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const serviceRes = await taskDetailService.update(req.body);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const serviceRes = await taskDetailService.getProductOptions(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    detail,
    getListTaskWorkFlow,
    update,
    getProductOptions,
};
