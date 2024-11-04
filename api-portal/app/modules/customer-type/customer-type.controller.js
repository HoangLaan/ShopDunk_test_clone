const httpStatus = require('http-status');
const customerTypeService = require('./customer-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');

const getListCustomerType = async (req, res, next) => {
    try {
        const serviceRes = await customerTypeService.getListCustomerType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createCustomerType = async (req, res, next) => {
    try {
        // Insert CustomerType
        const serviceRes = await customerTypeService.createCustomerTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CUSTOMERTYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateCustomerType = async (req, res, next) => {
    try {
        const customer_type_id = req.params.customer_type_id;
        req.body.customer_type_id = customer_type_id;

        // Check CustomerType exists
        const serviceResDetail = await customerTypeService.detailCustomerType(customer_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // const serviceResUsed = await customerTypeService.checkUsedCustomerType(customer_type_id);
        // if (serviceResUsed.isFailed()) {
        //     return next(serviceResUsed);
        // }
        // const check = serviceResUsed.getData();
        // if (!check) {
        //     return next(new ErrorResponse(null, null, RESPONSE_MSG.CUSTOMERTYPE.CHECK_USED_FAILED));
        // }

        // Update CustomerType
        const serviceRes = await customerTypeService.createCustomerTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CUSTOMERTYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteCustomerType = async (req, res, next) => {
    try {
        let list_id = apiHelper.getValueFromObject(req.body, 'list_id', []);

        for (let i = 0; i < list_id.length; i++) {
            const customer_type_id = list_id[i];
            // Check CUSTOMERTYPE exists
            const serviceResDetail = await customerTypeService.detailCustomerType(customer_type_id);
            if (serviceResDetail.isFailed()) {
                return next(serviceResDetail);
            }
            // const serviceResUsed = await customerTypeService.checkUsedCustomerType(customer_type_id);
            // if (serviceResUsed.isFailed()) {
            //     return next(serviceResUsed);
            // }
            // const check = serviceResUsed.getData();
            // if (!check) {
            //     return next(new ErrorResponse(null, null, RESPONSE_MSG.CUSTOMERTYPE.CHECK_USED_FAILED));
            // }
        }

        // Delete CUSTOMERTYPE
        const serviceRes = await customerTypeService.deleteCustomerType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailCustomerType = async (req, res, next) => {
    try {
        const customer_type_id = req.params.customer_type_id;

        // Check CUSTOMERTYPE exists
        const serviceRes = await customerTypeService.detailCustomerType(customer_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const changeStatusCustomerType = async (req, res, next) => {
    try {
        const customer_type_id = req.params.customer_type_id;
        // Check function exists
        const serviceResDetail = await customerTypeService.detailCustomerType(customer_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await customerTypeService.changeStatusCustomerType(customer_type_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('CRM_CUSTOMERTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getListCustomerType,
    createCustomerType,
    updateCustomerType,
    deleteCustomerType,
    detailCustomerType,
    changeStatusCustomerType,
    getOptions,
};
