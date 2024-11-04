const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const ExperienceClass = require('./experience.class');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');


const getListExperience = async (params = {}) => {
  try {

    const pool = await mssql.pool;
    const experiences = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
      .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
      .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
      .execute(PROCEDURE_NAME.MD_EXPERIENCE_GETLIST_ADMINWEB);
    return {
      list: ExperienceClass.list(experiences.recordsets[0]),
      total: experiences.recordsets[0][0]['TOTALITEMS'],
    };
  } catch (error) {
    console.error('ExperienceService.getList', error);
    return [];
  }

};


const createOrUpdateHandler = async ( bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const idUpdate = apiHelper.getValueFromObject(bodyParams, 'experience_id', null);
    const experience = await pool
      .request()
      .input('EXPERIENCEID',  idUpdate)
      .input('EXPERIENCENAME', apiHelper.getValueFromObject(bodyParams, 'experience_name', null))
      .input('EXPERIENCETYPE', apiHelper.getValueFromObject(bodyParams, 'experience_type', null))
      .input('EXPERIENCEFROM', apiHelper.getValueFromObject(bodyParams, 'experience_from', null))
      .input('EXPERIENCETO', apiHelper.getValueFromObject(bodyParams, 'experience_to', null))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
      .input('CREATEDUSER',idUpdate? apiHelper.getValueFromObject(bodyParams, 'updated_user', ''): apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
      .execute(PROCEDURE_NAME.MD_EXPERIENCE_CREATEORUPDATE_ADMINWEB);
    const experienceId = experience.recordset[0].RESULT;

    if (!experienceId || experienceId <= 0) {
      throw new Error("Create or update failed!")
    }
    return new ServiceResponse(true, 'Create or update successfully', experienceId);
  } catch (error) {
    logger.error(error, {function: 'ExperienceService.createOrUpdateHandler'});
    return new ServiceResponse(false, error.message);
  }
};


const getById = async experienceId => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('EXPERIENCEID', experienceId)
      .execute(PROCEDURE_NAME.MD_EXPERIENCE_GETBYID);

    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy loại công việc');
    }
    const result = ExperienceClass.detail(data.recordsets[0][0])

    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, { function: 'ExperienceService.getById' });
    return new ServiceResponse(false, error.message);
  }
};

const deleteExperience = async (experienceId,bodyParams)=> {
  try {
    const pool = await mssql.pool;
    console.log( apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
    await pool
      .request()
      .input('EXPERIENCEID', experienceId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.MD_EXPERIENCE_DELETE_ADMINWEB);
    return new ServiceResponse(true,'delete experience successfully!');
  } catch (e) {
    logger.error(e, { function: 'ExperienceService.deleteExperience' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteListExperience = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'EXPERIENCEID')
      .input('TABLENAME', 'MD_EXPERIENCE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, {function: 'ExperienceService.deleteListExperience'});
    return new ServiceResponse(false, 'Lỗi xoá danh sách kinh nghiệm');
  }
};

module.exports = {
  getListExperience,
  createOrUpdateHandler,
  getById,
  deleteExperience,
  deleteListExperience

};
