const httpStatus = require('http-status');
const service = require('./receive-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListReceiveType = async (req, res, next) => {
    try {
        const serviceRes = await service.getListReceiveType(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListBankAccount = async (req, res, next) => {
    try {
        const serviceRes = await service.getListBankAccount(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteReceiveType = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteReceiveType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.RECEIVETYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailReceiveType = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.detailReceiveType(req.params.receive_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a
 */
const createReceiveType = async (req, res, next) => {
    try {
        req.body.receive_type_id = null;
        const serviceRes = await service.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECEIVETYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a
 */
const updateReceiveType = async (req, res, next) => {
    try {
        const receive_type_id = req.params.receive_type_id;
        req.body.receive_type_id = receive_type_id;

        // Check exists
        const serviceResDetail = await service.detailReceiveType(receive_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECEIVETYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getReceiveTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getReceiveTypeOptions(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getCompanyOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getCompanyOptions(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getBusinessOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getBusinessOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getTree = async (req, res, next) => {
    try {
        const result = await service.getTree(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListReceiveType,
    deleteReceiveType,
    detailReceiveType,
    createReceiveType,
    updateReceiveType,
    getReceiveTypeOptions,
    getCompanyOptions,
    getBusinessOptions,
    getListBankAccount,
    getTree,
};
