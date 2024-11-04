const customerCompanyClass = require('../customer-company/customer-company.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const detailCustomerCompany = async (member_id) => {
    try {
      
      const pool = await mssql.pool; 
      const data = await pool.request()
        .input('MEMBERID', member_id)
        .execute(PROCEDURE_NAME.CRM_CUSTOMER_COMPANY_GETBYID);
      const customerCompany = data.recordset[0];

      if (customerCompany) {
        return new ServiceResponse(true, '', customerCompanyClass.detail(customerCompany));
      }
      return new ServiceResponse(false, '', null);
    } catch (e) {
      logger.error(e, { 'function': 'customerCompanyService.detailCustomerCompany' });
  
      return new ServiceResponse(false, e.message);
    }
  };

const createCustomerCompanyOrUpdate = async (body = {},member_id) => {
  
  const pool = await mssql.pool;
  try {
    const customer_company_id = apiHelper.getValueFromObject(body, 'customer_company_id')
    // Save 
    const data = await pool.request()
      .input('COMPANYID', Number(customer_company_id))
      .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id') || member_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMER_COMPANY_CREATEORUPDATE);
  
    return new ServiceResponse(true, '',data.recordsets.RESULT);
  } catch (error) {
    logger.error(error, { 'customerCompany': 'customerCompanyService.createCustomerCompanyOrUpdate' });
    console.error('customerCompanyService.createCustomerCompanyOrUpdate', error);
    return new ServiceResponse(false, error.message);
  }
};

// Custom
const createCustomerCompanyAccountOrUpdate = async (body = {},member_id) => {
  
  const pool = await mssql.pool;
  try {
    const company_id = apiHelper.getValueFromObject(body, 'company_id')
    // Save 
    const data = await pool.request()
      .input('COMPANYID', company_id)
      .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id') || member_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMER_COMPANY_CREATEORUPDATE);
  
    return new ServiceResponse(true, '',data.recordsets.RESULT);
  } catch (error) {
    logger.error(error, { 'customerCompany': 'customerCompanyService.createCustomerCompanyOrUpdate' });
    console.error('customerCompanyService.createCustomerCompanyOrUpdate', error);
    return new ServiceResponse(false, error.message);
  }
};

const createCustomerCompanyType = async (body = {}) => {
  
  const pool = await mssql.pool;
  try {
    // Save 
    const data = await pool.request()
      .input('COMPANYNAME', apiHelper.getValueFromObject(body, 'company_name'))
      .input('COMPANYTYPE', apiHelper.getValueFromObject(body, 'company_type') )
      .input('COMPANYPHONENUMBER', apiHelper.getValueFromObject(body, 'company_phone_number') )
      .input('COMPANYEMAIL', apiHelper.getValueFromObject(body, 'company_email') )
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_COMPANY_CREATEORUPDATE);
  
    return new ServiceResponse(true, '',data.recordsets.RESULT);
  } catch (error) {
    logger.error(error, { 'customerCompany': 'customerCompanyService.createCustomerCompanyOrUpdate' });
    console.error('customerCompanyService.createCustomerCompanyOrUpdate', error);
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  detailCustomerCompany,
  createCustomerCompanyOrUpdate,
  createCustomerCompanyAccountOrUpdate,
  createCustomerCompanyType,
};