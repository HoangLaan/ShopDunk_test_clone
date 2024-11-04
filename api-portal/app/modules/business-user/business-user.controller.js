const businessUserService = require('./business-user.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await businessUserService.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const serviceRes = await businessUserService.create(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BUSINESSUSER.CREATE_SUCCESS));
    } catch (error) {
        console.log({ error });
        // return next(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteBU = async (req, res, next) => {
    try {
        const serviceRes = await businessUserService.deleteBU(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.BUSINESSUSER.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getListAllUser = async (req, res, next) => {
    try {
        const serviceRes = await businessUserService.getListAllUser(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getUserOfBus = async (req, res, next) => {
    try {
        let { id = 0 } = req.params;
        const serviceRes = await businessUserService.getUserOfBus(id);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStores = async (req, res, next) => {
    try {
        const serviceRes = await businessUserService.getStores(req.body);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    create,
    deleteBU,
    getListAllUser,
    getUserOfBus,
    getStores,
};
