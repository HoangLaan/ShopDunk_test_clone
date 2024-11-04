const WorkTypeClass = require('./work-type.class');
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
const getListWorkType = async (queryParams = {}) => {
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
      .execute('HR_WORKTYPE_GetList_AdminWeb');
    const list = WorkTypeClass.list(data.recordsets[0]) ;

    const total = apiHelper.getTotalData(data.recordsets[0]);
    return new ServiceResponse(true, '',  {list, total});
  } catch (e) {
    logger.error(e, { 'function': 'WorkTypeService.getListWorkType' });
    return new ServiceResponse(true, '', {});
  }
};

// detail detailWorkType
const detailWorkType = async (workTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('WORKTYPEID', workTypeId)
      .execute('HR_WORKTYPE_GetById_AdminWeb');
    let workType = data.recordset;
    // If exists 
    if (workType && workType.length > 0) {
      workType = WorkTypeClass.detail(workType[0]);
      return new ServiceResponse(true, '', workType);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'WorkTypeService.detailWorkType' });
    return new ServiceResponse(false, e.message);
  }
};

//Delete WorkType
const deleteWorkType = async (workTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('WORKTYPEID', workTypeId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('HR_WORKTYPE_Delete_AdminWeb');
    return new ServiceResponse(true, RESPONSE_MSG.CRUD.DELETE_SUCCESS, '');
  } catch (e) {
    logger.error(e, { 'function': 'WorkTypeService.deleteWorkType' });
    return new ServiceResponse(false, e.message);
  }
}


// create or update WorkType 
const createOrUpdateWorkType = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('WORKTYPEID', apiHelper.getValueFromObject(bodyParams, 'work_type_id'))
      .input('WORKTYPENAME', apiHelper.getValueFromObject(bodyParams, 'work_type_name'))
      .execute('HR_WORKTYPE_CheckName_AdminWeb');
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
      return new ServiceResponse(false, RESPONSE_MSG.WORKTYPE.EXISTS_NAME, null);
    }
    const data = await pool.request()
      .input('WORKTYPEID', apiHelper.getValueFromObject(bodyParams, 'work_type_id'))
      .input('WORKTYPENAME', apiHelper.getValueFromObject(bodyParams, 'work_type_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('HR_WORKTYPE_CreateOrUpdate_AdminWeb');
    const workTypeId = data.recordset[0].RESULT;
    return new ServiceResponse(true, 'update success', workTypeId);
  } catch (e) {
    logger.error(e, { 'function': 'WorkTypeService.createOrUpdateWorkType' });
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListWorkType,
  detailWorkType,
  deleteWorkType,
  createOrUpdateWorkType
};
