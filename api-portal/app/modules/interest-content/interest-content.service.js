const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const interestContentClass = require('./interest-content.class');

const spName = {
  createOrUpdate: 'CRM_INTERESTCONTENT_CreateOrUpdate_AdminWeb',
  getList: 'CRM_INTERESTCONTENT_GetList_AdminWeb',
  getById: 'CRM_INTERESTCONTENT_GetById_AdminWeb',
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
      data: interestContentClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (error) {
    logger.error(error, { function: 'interestContentService.getList' });
    return new ServiceResponse(true, '', {});
  }
};

const getById = async (interestContentId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().input('INTERESTCONTENTID', interestContentId).execute(spName.getById);

    if (!data.recordset[0]) {
      return new ServiceResponse(false, 'Không tìm thấy nội dung quan tâm');
    }

    return new ServiceResponse(true, '', interestContentClass.getById(data.recordset[0]));
  } catch (error) {
    logger.error(error, { function: 'interestContentService.getById' });
    return new ServiceResponse(false, error.message);
  }
};

const createOrUpdate = async (body) => {
  try {
    const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
    const pool = await mssql.pool;
    const result = await pool
      .request()
      .input('INTERESTCONTENTID', apiHelper.getValueFromObject(body, 'interest_content_id'))
      .input('INTERESTCONTENTNAME', apiHelper.getValueFromObject(body, 'interest_content_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', authName)
      .execute(spName.createOrUpdate);

    const idResult = result.recordset[0].RESULT;
    if (!idResult) {
      return new ServiceResponse(false, 'Lỗi lưu nội dung quan tâm');
    }
    return new ServiceResponse(true, 'Lưu nội dung quan tâm thành công', {
      interest_content_id: idResult,
    });
  } catch (error) {
    logger.error(error, { function: 'interestContentService.createOrUpdate' });
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
      .input('NAMEID', 'INTERESTCONTENTID')
      .input('TABLENAME', 'CRM_INTERESTCONTENT')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, { function: 'interestContentService._delete' });
    return new ServiceResponse(false, '', {});
  }
};

module.exports = {
  getList,
  getById,
  createOrUpdate,
  delete: _delete,
};
