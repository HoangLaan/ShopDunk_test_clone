const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const service = require('./payment-form.service');
/**
 * Get list payment-form
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getPaymentFormList = async (req, res, next) => {
    try {
        const serviceRes = await service.getPaymentFormList(req.query);
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
 * Create new a PaymentForm
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createPaymentForm = async (req, res, next) => {
    try {
        // Insert PaymentForm
        const serviceRes = await service.createOrUpdatePaymentForm(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a PaymentForm
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updatePaymentForm = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await service.paymentFormDetail(req.body.payment_form_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdatePaymentForm(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * delete a paymentForm
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deletePaymentForm = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.deletePaymentForm(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a paymentForm
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const paymentFormDetail = async (req, res, next) => {
    try {
        const payment_form_id = req.params.payment_form_id;

        // Check exists
        const serviceRes = await service.paymentFormDetail(payment_form_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list by store
 */
const getListByStore = async (req, res, next) => {
    try {
        const serviceRes = await service.getListByStore(req.params.store_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getPaymentFormList,
    createPaymentForm,
    updatePaymentForm,
    deletePaymentForm,
    paymentFormDetail,
    getListByStore,
    getOptions,
};
