const OffWorkManagementService = require('./offwork-management.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const MailService = require('../../common/services/mail.service');
/**
 * Get list AM_COMPANY
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkManagementService.getList(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdate = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkManagementService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDepartmentByBlock = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkManagementService.getDepartmentByBlock(Object.values(req.query));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDetail = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkManagementService.getDetail(req.params);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deletePolicy = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkManagementService.deletePolicy(Object.assign({},req.body,req.params,req.auth_name));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDepartmentByBlock,
    getDetail,
    deletePolicy
};
