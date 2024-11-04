const httpStatus = require('http-status');
const accountingAccountService = require('./accounting-account.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/accounting_account`);
const formidable = require('formidable');
const mkdirp = require('mkdirp-promise');
const fs = require('fs');
/**
 * Get list AccountingAccount
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListAccountingAccount = async (req, res, next) => {
    try {
        const result = await accountingAccountService.getList(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total } = result.getData();
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const result = await accountingAccountService.getOptions(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a AccountingAccount
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createAccountingAccount = async (req, res, next) => {
    try {
        const result = await accountingAccountService.createOrUpdate(null, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a AccountingAccount
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateAccountingAccount = async (req, res, next) => {
    try {
        // Check AccountingAccount exists
        const accountingAccount = await accountingAccountService.detail(req.params.id);
        if (accountingAccount.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update AccountingAccount
        const result = await accountingAccountService.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteAccountingAccount = async (req, res, next) => {
    try {
        // Delete AccountingAccount
        const serviceRes = await accountingAccountService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailAccountingAccount = async (req, res, next) => {
    try {
        // Check AccountingAccount exists
        const accountingAccount = await accountingAccountService.detail(req.params.id);
        if (accountingAccount.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(accountingAccount.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcelAccountingAccount = async (req, res, next) => {
    try {
        let resService = await accountingAccountService.exportExcel(req.query);
        if (resService.isFailed()) {
            return next(resService);
        }
        let data = resService.getData();
        data.write('exportExcel.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTree = async (req, res, next) => {
    try {
        const result = await accountingAccountService.getTree(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const importExcel = async (req, res, next) => {
    try {
        if (!Boolean(req.file)) {
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, '', 'Vui lòng chọn file để tải lên'));
        }
        accountingAccountService.importExcel(req.body, req.file).then((serviceRes) => {
            if (serviceRes.isFailed()) {
                return next(serviceRes);
            }
            return res.json(new SingleResponse(serviceRes.getData()));
        });
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const downloadTemplate = async (req, res, next) => {
    try {
        let resService = await accountingAccountService.downloadTemplate();
        if (resService.isFailed()) {
            return next(resService);
        }
        let wb = resService.getData();
        wb.write('TemplateAccountingAccount.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getListAccountingAccount,
    createAccountingAccount,
    updateAccountingAccount,
    deleteAccountingAccount,
    detailAccountingAccount,
    exportExcelAccountingAccount,
    getTree,
    importExcel,
    downloadTemplate,
    getOptions,
};
