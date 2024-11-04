const originClass = require('./origin.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
/**
 * Get list MD_ORIGIN
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListOrigin = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_ORIGIN_GETLIST_ADMINWEB);
    const origins = data.recordsets[0];
    const totalItem = data.recordsets[0][0].TOTAL;
    return new ServiceResponse(true, '', {
      'data': originClass.list(origins),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': totalItem,
    });
  } catch (e) {
    logger.error(e, { 'function': 'OriginService.getListOrigin' });
    return new ServiceResponse(true, '', {});
  }
};

// detail Origin
const detailOrigin = async (originId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('ORIGINID', originId)
      .execute(PROCEDURE_NAME.MD_ORIGIN_GETBYID_ADMINWEB);
    let origin = data.recordset;
    // If exists 
    if (origin && origin.length > 0) {
      origin = originClass.detail(origin[0]);
      return new ServiceResponse(true, '', origin);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'OriginService.detailOrigin' });
    return new ServiceResponse(false, e.message);
  }
};

//Delete Origin
const deleteOrigin = async (originId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('ORIGINID', originId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_ORIGIN_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS, '');
  } catch (e) {
    logger.error(e, { 'function': 'OriginService.deleteOrigin' });
    return new ServiceResponse(false, e.message);
  }
}

// change Status Origin
const changeStatusOrigin = async (originId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('ORIGINID', originId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
      .execute(PROCEDURE_NAME.MD_ORIGIN_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true, 'change status success', { isSuccess: true });
  } catch (e) {
    logger.error(e, { 'function': 'OriginService.changeStatusOrigin' });
    return new ServiceResponse(false);
  }
};

// create or update origin 
const createOrUpdateOrigin = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('ORIGINID', apiHelper.getValueFromObject(bodyParams, 'origin_id'))
      .input('ORIGINNAME', apiHelper.getValueFromObject(bodyParams, 'origin_name'))
      .execute(PROCEDURE_NAME.MD_ORIGIN_CHECKNAME_ADMINWEB);
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
      return new ServiceResponse(false, RESPONSE_MSG.ORIGIN.EXISTS_NAME, null);
    }

    const data = await pool.request()
      .input('ORIGINID', apiHelper.getValueFromObject(bodyParams, 'origin_id'))
      .input('ORIGINNAME', apiHelper.getValueFromObject(bodyParams, 'origin_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_ORIGIN_CREATEORUPDATE_ADMINWEB);
    const originId = data.recordset[0].RESULT;
    return new ServiceResponse(true, 'update success', originId);
  } catch (e) {
    logger.error(e, { 'function': 'OriginService.createOrUpdateOrigin' });
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListOrigin,
  detailOrigin,
  deleteOrigin,
  changeStatusOrigin,
  createOrUpdateOrigin
};
