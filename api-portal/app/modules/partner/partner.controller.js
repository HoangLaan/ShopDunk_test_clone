const httpStatus = require('http-status');
const partnerService = require('./partner.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListPartner = async (req, res, next) => {
    try {
        const serviceRes = await  partnerService.getList(req.query)
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        const { list, total, page, itemsPerPage } = serviceRes.getData();
        return res.json(new ListResponse(list, total, page,itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createPartner = async (req, res, next) => {
    try {
        const result = await partnerService.createOrUpdate(null, req.body);
        if (result?.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updatePartner = async (req, res, next) => {
    try {
        // Check Partner exists
        const partner = await partnerService.detail(req.params.id);
        if (partner.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Partner
        const result = await partnerService.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deletePartner = async (req, res, next) => {
    try {
        // Delete Partner
        const serviceRes = await partnerService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailPartner = async (req, res, next) => {
    try {
        // Check Partner exists
        const partner = await partnerService.detail(req.params.id);
        if (partner.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(partner.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('AM_BUSINESS', req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsListAccount = async (req, res, next) => {
    try {
        const serviceRes = await partnerService.getOptionsListAccount(req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getOptionSource = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_SOURCE', req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionUser = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SYS_USER', req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionAccount = async (req, res, next) => {
    try {
        const serviceRes = await optionService('CRM_ACCOUNT', req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionCustomerType = async (req, res, next) => {
    try {
        const serviceRes = await optionService('CRM_CUSTOMERTYPE', req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCustomerContact = async (req, res, next) => {
    try {
        const serviceRes = await partnerService.getCustomerContact(req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        const { list, total } = await partnerService.getCustomerContact(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCustomerTypeInfo = async (req, res, next) => {
    try {
        try {
            // Check Partner exists
            const partner = await partnerService.getCustomerTypeInfo(req.params.id);
            if (partner.isFailed()) {
                return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
            }
            return res.json(new SingleResponse(partner.getData()));
        } catch (error) {
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
        }
    } catch (error) {}
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await partnerService.exportExcel(req.body);
  
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
  
        const wb = serviceRes.getData();
        wb.write('partner.xlsx', res);
    } catch (error) {
        return next(error);
    }
  };

module.exports = {
    getListPartner,
    createPartner,
    updatePartner,
    deletePartner,
    detailPartner,
    getOptions,
    getOptionSource,
    getOptionUser,
    getOptionAccount,
    getOptionCustomerType,
    getCustomerContact,
    getCustomerTypeInfo,
    exportExcel,
    getOptionsListAccount
};
