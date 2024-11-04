const httpStatus = require('http-status');
const service = require('./business-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');

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
        const serviceRes = await optionService('AM_BUSINESSTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list
 */
const getListBusinessType = async (req, res, next) => {
        try {
            const {list, total} = await service.getListBusinessType(req.query);
            return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
        } catch (error) {
            return next(error);
        }
    };

/**
 * Create new a business type
 */
const createBusinessType = async (req, res, next) => {
    try {
        req.body.created_user = req.auth.user_name;
        const serviceRes = await service.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update  business type
 */
const updateBusinessType = async (req, res, next) => {
    try {
        req.body.updated_user = req.auth.user_name;
        const serviceRes = await service.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Delete  business type
 */
const deleteBusinessType = async (req, res, next) => {
    try {

        const businessTypeId = req.params.id
        // Check Business Type exists
        const serviceResDetail = await service.getBusinessTypeById(businessTypeId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        req.body.deleted_user = req.auth.user_id;
        // Delete Business Type
        const serviceRes = await service.deleteBusinessType(businessTypeId,req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }

};

/**
 * Delete list  business type
 */
const deleteListBusinessType = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteListBusinessType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá business type thành công'));
    } catch (error) {
        return next(error);
    }
};


const getBusinessTypeById = async (req, res, next) => {
    try {
        const id = req.params.id
        const serviceRes = await service.getBusinessTypeById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getOptions,
    getListBusinessType,
    getBusinessTypeById,
    createBusinessType,
    updateBusinessType,
    deleteBusinessType,
    deleteListBusinessType
};
