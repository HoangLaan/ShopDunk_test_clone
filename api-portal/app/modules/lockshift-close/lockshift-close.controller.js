const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { PRODUCT_CATEGORY_TYPE } = require('./constants');
const service = require('./lockshift-close.service');

const getListLockshift = async (req, res, next) => {
    try {
        const serviceRes = await service.getListLockshift(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createLockshiftAll = async (req, res, next) => {
    try {
        const serviceRes = await service.createOrUpdateLockshift(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS,serviceRes.getData));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateLockshiftAll = async (req, res, next) => {
    try {
        const serviceRes = await service.createOrUpdateLockshift(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailLockshift = async (req, res, next) => {
    try {
        const serviceRes = await service.getDetailLockshift(Object.assign(req.params, req.body));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const statisticsLockshift = async (req, res, next) => {
    try {
        const serviceRes = await service.statisticsLockshift(Object.assign(req.params, req.body));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListProducts = async (req, res, next) => {
    try {
        const serviceRes = await service.getListProduct({
            ...req.query,
            category_type: PRODUCT_CATEGORY_TYPE.PRODUCT_TYPE,
        });

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListEquipment = async (req, res, next) => {
    try {
        const serviceRes = await service.getListProduct({
            ...req.query,
            category_type: PRODUCT_CATEGORY_TYPE.CONSUMABLE_EQUIPMENT_TYPE,
        });

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListLockshiftProducts = async (req, res, next) => {
    try {
        const serviceRes = await service.getListLockshiftProduct(Object.assign(req.body, req.params, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListLockshiftEquipment = async (req, res, next) => {
    try {
        const serviceRes = await service.getListLockshiftEquipment(Object.assign(req.params, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductInventory = async (req, res, next) => {
    try {
        const serviceRes = await service.getProductInventory(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(),serviceRes?.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const checkValidShift = async (req, res, next) => {
    try {
        const serviceRes = await service.checkValidShift(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(),serviceRes?.getMessage()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListLockshiftCustomer = async (req, res, next) => {
    try {
        const serviceRes = await service.getListLockshiftCustomer(Object.assign(req.params, req.body));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListLockshift,
    createLockshiftAll,
    updateLockshiftAll,
    detailLockshift,
    statisticsLockshift,
    getListLockshiftProducts,
    getListLockshiftEquipment,
    getListLockshiftCustomer,
    getListProducts,
    getListEquipment,
    getProductInventory,
    checkValidShift,
};
