const httpStatus = require('http-status');
const customerCompanyService = require('./customer-company.service');
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
    const serviceRes = await optionService('CRM_COMPANY', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * detail customer company
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const detailCustomerCompany = async (req, res, next) => {
  try {
    const member_id = req.params.customer_company_id;
    const serviceRes = await customerCompanyService.detailCustomerCompany(member_id);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Create Customer Company Type
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCustomerCompanyType= async (req, res, next) => {
  try {

    // Insert CustomerType
    const serviceRes = await customerCompanyService.createCustomerCompanyType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CUSTOMERCOMPANY.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update Customer Company
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCustomerCompany = async (req, res, next) => {
  try {
    const member_id = req.params.customer_company_id;
    // Update customerCompany
    const serviceRes = await customerCompanyService.createCustomerCompanyOrUpdate(req.body,member_id);

    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERCOMPANY.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

module.exports = {
  getOptions,
  detailCustomerCompany,
  updateCustomerCompany,
  createCustomerCompanyType,
};
