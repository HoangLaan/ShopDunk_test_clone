const httpStatus = require('http-status');
const customerCareTypeService = require('./customer-care-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list Customer Case Type
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCustomerCareType = async (req, res, next) => {
    try {
        const serviceRes = await customerCareTypeService.getList(req.query);
        if (serviceRes.isFailed()) {
            next(serviceRes);
        }
        let { list, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(list, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Customer Case Type
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCustomerCareType = async (req, res, next) => {
    try {
        const result = await customerCareTypeService.createOrUpdate(null, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Customer Case Type
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCustomerCareType = async (req, res, next) => {
    try {
        const result = await customerCareTypeService.createOrUpdate(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteCustomerCareType = async (req, res, next) => {
    try {
        // Delete Customer Case Type
        const serviceRes = await customerCareTypeService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailCustomerCareType = async (req, res, next) => {
    try {
        // Check Customer Case Type exists
        const customerCaseType = await customerCareTypeService.detail(req.params.id);
        if (!customerCaseType) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(customerCaseType.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDepartment = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPosition = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_POSITION', req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list User
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListUser = async (req, res, next) => {
    try {
        let serviceRes = await customerCareTypeService.getListUser(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { list, total } = serviceRes.getData();
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getListCustomerCareType,
    createCustomerCareType,
    updateCustomerCareType,
    deleteCustomerCareType,
    detailCustomerCareType,
    getDepartment,
    getPosition,
    getListUser,
};
