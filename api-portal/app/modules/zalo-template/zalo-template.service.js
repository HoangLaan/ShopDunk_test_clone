const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const zaloTemplateClass = require('./zalo-template.class');

const spName = {
  createOrUpdate: 'CRM_ZALOTEMPLATE_CreateOrUpdate_AdminWeb',
  getList: 'CRM_ZALOTEMPLATE_GetList_AdminWeb',
  getById: 'CRM_ZALOTEMPLATE_GetById_AdminWeb',
};

const getList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(spName.getList);

    const result = data.recordset;

    return new ServiceResponse(true, '', {
      data: zaloTemplateClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (error) {
    logger.error(error, { function: 'zaloTemplateService.getList' });
    return new ServiceResponse(true, '', {});
  }
};

const getById = async (zaloTemplateId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().input('ZALOTEMPLATEID', zaloTemplateId).execute(spName.getById);

    if (!data.recordset[0]) {
      return new ServiceResponse(false, 'Không tìm thấy mẫu tin nhắn');
    }

    return new ServiceResponse(true, '', zaloTemplateClass.getById(data.recordset[0]));
  } catch (error) {
    logger.error(error, { function: 'zaloTemplateService.getById' });
    return new ServiceResponse(false, error.message);
  }
};

const createOrUpdate = async (body) => {
  try {
    const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
    const pool = await mssql.pool;
    const result = await pool
      .request()
      .input('ZALOTEMPLATEID', apiHelper.getValueFromObject(body, 'zalo_template_id'))
      .input('ZALOTEMPLATENAME', apiHelper.getValueFromObject(body, 'zalo_template_name'))
      .input('ZALOTEMPLATE', apiHelper.getValueFromObject(body, 'zalo_template'))
      .input('IMAGEURL', apiHelper.getValueFromObject(body, 'image_url'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', authName)
      .execute(spName.createOrUpdate);

    const idResult = result.recordset[0].RESULT;
    if (!idResult) {
      return new ServiceResponse(false, 'Lỗi lưu mẫu tin nhắn');
    }
    return new ServiceResponse(true, 'Lưu mẫu tin nhắn thành công', {
      zalo_template_id: idResult,
    });
  } catch (error) {
    logger.error(error, { function: 'zaloTemplateService.createOrUpdate' });
    return new ServiceResponse(false, error.message);
  }
};

const _delete = async (bodyParams) => {
  try {
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    const pool = await mssql.pool;
    await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'ZALOTEMPLATEID')
      .input('TABLENAME', 'CRM_ZALOTEMPLATE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, { function: 'zaloTemplateService._delete' });
    return new ServiceResponse(false, '', {});
  }
};

const getListHistory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(spName.getList);

    const result = data.recordset;

    return new ServiceResponse(true, '', {
      data: zaloTemplateClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (error) {
    logger.error(error, { function: 'zaloTemplateService.getListHistory' });
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getList,
  getById,
  createOrUpdate,
  delete: _delete,
  getListHistory
};
