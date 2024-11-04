const companyService = require('./company.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list AM_COMPANY
 */
const getListCompany = async (req, res, next) => {
    try {
        const serviceRes = await companyService.getListCompany(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail AM_COMPANY
 */
const detailCompany = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await companyService.detailCompany(req.params.companyId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a AM_COMPANY
 */
const createCompany = async (req, res, next) => {
    try {
        req.body.company_id = null;
        const serviceRes = await companyService.createCompanyOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMPANY.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a Company
 */
const updateCompany = async (req, res, next) => {
    try {
        const companyId = req.params.companyId;
        req.body.company_id = companyId;

        // Check company exists
        const serviceResDetail = await companyService.detailCompany(companyId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update company
        const serviceRes = await companyService.createCompanyOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMPANY.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status AM_COMPANY
 */
const changeStatusCompany = async (req, res, next) => {
    try {
        const companyId = req.params.companyId;

        // Check userGroup exists
        const serviceResDetail = await companyService.detailCompany(companyId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update status
        await companyService.changeStatusCompany(companyId, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.COMPANY.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete AM_COMPANY
 */
const deleteCompany = async (req, res, next) => {
    try {
        const companyId = req.params.companyId;

        // Check company exists
        const serviceResDetail = await companyService.detailCompany(companyId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete company
        const serviceRes = await companyService.deleteCompany(companyId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.COMPANY.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

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
        const serviceRes = await optionService('AM_COMPANY', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await companyService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('LIST_COMPANY.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list  AM_COMPANY FOR USER
 */
const getOptionsForUser = async (req, res, next) => {
    try {
        // Check company exists
        const username = req.body.auth_name;
        let serviceRes;
        // Neu la administrator thi lay tat ca
        if (username == 'administrator') {
            serviceRes = await optionService('AM_COMPANY', req.query);
        }
        else serviceRes = await companyService.getOptionsForUser(username);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Lay danh sach tai khoan cua ngan hang
const getBankAccountOptions = async (req, res, next) => {
    try {
        let serviceRes = await companyService.getBankAccountOptions(Object.assign({}, req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListCompany,
    detailCompany,
    createCompany,
    updateCompany,
    changeStatusCompany,
    deleteCompany,
    getOptions,
    exportExcel,
    getOptionsForUser,
    getBankAccountOptions,
};
