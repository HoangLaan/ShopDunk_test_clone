const httpStatus = require('http-status');
const payPartnerService = require('./pay-partner.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
/**
 * Get list pay partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListPayPartner = async (req, res, next) => {
    try {
        const result = await payPartnerService.getList(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total, page, itemsPerPage } = result.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListStoreBankAccount = async (req, res, next) => {
    try {
        const result = await payPartnerService.getListStoreBankAccount(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total, page, itemsPerPage } = result.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a pay partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createPayPartner = async (req, res, next) => {
    try {
        const result = await payPartnerService.createOrUpdate(null, req.body);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a pay partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updatePayPartner = async (req, res, next) => {
    try {
        // Check pay partner exists
        const detail = await payPartnerService.detail(req.params.id);
        if (detail.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update pay partner
        const result = await payPartnerService.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deletePayPartner = async (req, res, next) => {
    try {
        // Delete pay partner
        const serviceRes = await payPartnerService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailPayPartner = async (req, res, next) => {
    try {
        // Check pay partner exists
        const serviceRes = await payPartnerService.detail(req.params.id);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const upload = async (req, res, next) => {
    try {
        let url = null;
        if (!req.files)
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));
        let file = req.files[0];
        if (file.buffer || !file.includes(config.domain_cdn)) {
            url = await fileHelper.saveFileV2(file);
        } else {
            url = file.split(config.domain_cdn)[1];
        }
        return res.json(
            new SingleResponse({
                file_name: file.originalname,
                file_url: `${url}`,
            }),
        );
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListOptions = async (req, res, next) => {
    try {
        const serviceRes = await payPartnerService.getListOptions(req.query);
        if (serviceRes.isFailed()) {
            return res.json(new SingleResponse([]));
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListPayPartner,
    createPayPartner,
    updatePayPartner,
    deletePayPartner,
    detailPayPartner,
    upload,
    getListStoreBankAccount,
    getListOptions,
};
