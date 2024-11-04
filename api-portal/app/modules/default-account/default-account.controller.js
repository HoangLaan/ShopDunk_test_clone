const httpStatus = require('http-status');
const defaultAccountService = require('./default-account.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mkdirp = require('mkdirp-promise');
const formidable = require('formidable');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/defaultAccounts`);
const fs = require('fs');
const apiConst = require('../../common/const/api.const');

/**
 * Get list Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListDefaultAccount = async (req, res, next) => {
    try {
        const { list, total } = await defaultAccountService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDocumentOptions = async (req, res, next) => {
    try {
        const data = await defaultAccountService.getDocumentOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getAccountingAccountOptions = async (req, res, next) => {
    try {
        const data = await defaultAccountService.getAccountingAccountOptions(req.query);
        return res.json(new ListResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createDefaultAccount = async (req, res, next) => {
    try {
        const result = await defaultAccountService.createOrUpdate(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateDefaultAccount = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const defaultAccount = await defaultAccountService.detail(req.params.id);
        if (!defaultAccount) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Task Work Flow
        req.body.id = req.params.id;
        const result = await defaultAccountService.createOrUpdate(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteDefaultAccount = async (req, res, next) => {
    try {
        // Delete Task Work Flow
        const serviceRes = await defaultAccountService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailDefaultAccount = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const defaultAccount = await defaultAccountService.detail(req.params.id);
        if (!defaultAccount) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(defaultAccount));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        req.query.itemsPerPage = apiConst.MAX_EXPORT_EXCEL;
        const serviceRq = await defaultAccountService.exportExcel(req.query);
        if (serviceRq.isFailed()) {
            return next(serviceRq);
        }
        const wb = serviceRq.getData();
        wb.write('DefaultAccount.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.NOT_FOUND));
    }
};

module.exports = {
    getListDefaultAccount,
    createDefaultAccount,
    updateDefaultAccount,
    deleteDefaultAccount,
    detailDefaultAccount,
    exportExcel,
    getDocumentOptions,
    getAccountingAccountOptions,
};
