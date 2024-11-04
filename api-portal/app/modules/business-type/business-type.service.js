const moduleClass = require('./business-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_BUSINESSTYPE_OPTIONS);
};


const getListBusinessType = async (params = {}) => {
  try {

    const pool = await mssql.pool;
    const businessTypes = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
      .input('FROMDATE', apiHelper.getValueFromObject(params, 'created_date_from', null))
      .input('TODATE', apiHelper.getValueFromObject(params, 'created_date_to', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
      .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
      .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_GETLIST_ADMINWEB);
    return {
      list: moduleClass.list(businessTypes.recordsets[0]),
      total: businessTypes.recordsets[0][0]['TOTALITEMS'],
    };
  } catch (error) {
    logger.error('getListBusinessType.getList', error);
    return [];
  }

};


const createOrUpdateHandler = async ( bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const idUpdate = apiHelper.getValueFromObject(bodyParams, 'business_type_id', null);
    const businessType = await pool
      .request()
      .input('BUSINESSTYPEID', idUpdate)
      .input('BUSINESSTYPENAME', apiHelper.getValueFromObject(bodyParams, 'business_type_name', null))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
      .input('CREATEDUSER',idUpdate? apiHelper.getValueFromObject(bodyParams, 'updated_user', ''): apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
      .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_CREATEORUPDATE_ADMINWEB);
    const businessTypeId = businessType.recordset[0].RESULT;

    if (!businessTypeId || businessTypeId <= 0) {
      throw new Error("Create or update failed!")
    }
    return new ServiceResponse(true, 'Create or update successfully', businessTypeId);
  } catch (error) {
    logger.error(error, {function: 'BusinessTypeService.createOrUpdateHandler'});
    return new ServiceResponse(false, error.message);
  }
};


const getBusinessTypeById = async businessTypeId => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('BUSINESSTYPEID', businessTypeId)
      .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_GETBYID_ADMINWEB);

    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy loại miền');
    }
    const result = moduleClass.detail(data.recordsets[0][0])

    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, { function: 'BusinessTypeService.getById' });
    return new ServiceResponse(false, error.message);
  }
};

const deleteBusinessType = async (businessTypeId,bodyParams)=> {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('BUSINESSTYPEID', businessTypeId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_DELETE_ADMINWEB);
    return new ServiceResponse(true,'delete business type successfully!');
  } catch (e) {
    logger.error(e, { function: 'BusinessTypeService.deleteBusinessType' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteListBusinessType = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'BUSINESSTYPEID')
      .input('TABLENAME', 'AM_BUSINESSTYPE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, {function: 'BusinessTypeService.deleteListBusinessType'});
    return new ServiceResponse(false, 'Lỗi xoá danh sách business type');
  }
};


module.exports = {
  createOrUpdateHandler,
  deleteBusinessType,
  deleteListBusinessType,
  getBusinessTypeById,
  getListBusinessType

};
