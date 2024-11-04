const degreeClass = require('../degree/degree.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'degree';
const config = require('../../../config/config');

const getListDegree = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute("MD_DEGREE_GetList_AdminWeb");
    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': degreeClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, { 'function': 'degreeService.getListDegree' });
    return new ServiceResponse(true, '', {});
  }
};

const detailDegree = async (degreeid) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DEGREEID', degreeid)
      .execute("MD_DEGREE_GetById_AdminWeb");

    let degree = data.recordset;

    if (degree && degree.length > 0) {
      degree = degreeClass.detail(degree[0]);
      return new ServiceResponse(true, '', degree);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'degreeService.detailDegree' });
    return new ServiceResponse(false, e.message);
  }
};
const createDegreeOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DEGREEID', apiHelper.getValueFromObject(bodyParams, 'degree_id'))
      .input('DEGREENAME', apiHelper.getValueFromObject(bodyParams, 'degree_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("MD_DEGREE_CreateOrUpdate_AdminWeb");
    const degree_id = data.recordset[0].RESULT;
    return new ServiceResponse(true, '', {
      degree_id,
      status: 'success',
      message: 'Lưu thành công!'
    });
  } catch (e) {
    logger.error(e, { 'function': 'degreeService.createDegreeOrUpdate' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteDegree = async (bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('DEGREEIDS', apiHelper.getValueFromObject(bodyParams, "ids"))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("MD_DEGREE_Delete_AdminWeb");
    return new ServiceResponse(true, RESPONSE_MSG.DEGREE.DELETE_SUCCESS, true);
  } catch (e) {
    logger.error(e, { 'function': 'degreeService.deleteDegree' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListDegree,
  detailDegree,
  deleteDegree,
  createDegreeOrUpdate,
};
