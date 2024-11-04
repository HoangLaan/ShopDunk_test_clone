const salaryClass = require('./salary.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
/**
 * Get list 
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListSalary = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute('HR_salary_GetList_AdminWeb');
    const list = salaryClass.list(data.recordsets[0]) ;
    const total = apiHelper.getTotalData(data.recordsets[0]);
    return new ServiceResponse(true, '',  {list, total});
  } catch (e) {
    logger.error(e, { 'function': 'salaryService.getListSalary' });
    return new ServiceResponse(true, '', {});
  }
};

// detail detailSalary
const detailSalary = async (salaryId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('salaryID', salaryId)
      .execute('HR_salary_GetById_AdminWeb');
    let salary = data.recordset;
    // If exists 
    if (salary && salary.length > 0) {
      salary = salaryClass.detail(salary[0]);
      return new ServiceResponse(true, '', salary);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'salaryService.detailSalary' });
    return new ServiceResponse(false, e.message);
  }
};

//Delete salary
const deleteSalary = async (salaryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('salaryID', salaryId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('HR_salary_Delete_AdminWeb');
    return new ServiceResponse(true, RESPONSE_MSG.CRUD.DELETE_SUCCESS, '');
  } catch (e) {
    logger.error(e, { 'function': 'salaryService.deleteSalary' });
    return new ServiceResponse(false, e.message);
  }
}


// create or update salary 
const createOrUpdateSalary = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('salaryID', apiHelper.getValueFromObject(bodyParams, 'salary_id'))
      .input('salaryNAME', apiHelper.getValueFromObject(bodyParams, 'salary_name'))
      .execute('HR_salary_CheckName_AdminWeb');
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
      return new ServiceResponse(false, RESPONSE_MSG.salary.EXISTS_NAME, null);
    }
    const data = await pool.request()
      .input('salaryID', apiHelper.getValueFromObject(bodyParams, 'salary_id'))
      .input('salaryNAME', apiHelper.getValueFromObject(bodyParams, 'salary_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('SALARYFROM', apiHelper.getValueFromObject(bodyParams, 'salary_from'))
      .input('SALARYTO', apiHelper.getValueFromObject(bodyParams, 'salary_to'))

      .execute('HR_salary_CreateOrUpdate_AdminWeb');
    const salaryId = data.recordset[0].RESULT;
    return new ServiceResponse(true, 'update success', salaryId);
  } catch (e) {
    logger.error(e, { 'function': 'salaryService.createOrUpdateSalary' });
    return new ServiceResponse(false);
  }
};

const getOptions = async () => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .execute('HR_salary_GetOptions_AdminWeb');
    const list = salaryClass.options(data.recordsets[0]) ;
    return new ServiceResponse(true, '',  list);
  } catch (e) {
    logger.error(e, { 'function': 'salaryService.getOptions' });
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListSalary,
  detailSalary,
  deleteSalary,
  createOrUpdateSalary,
  getOptions
};
