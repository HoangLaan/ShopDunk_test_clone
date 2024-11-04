const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const materialGroupClass = require('./material-group.class')
const ServiceResponse = require('../../common/responses/service.response');

const createOrUpdateHandler = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const listAttribute = apiHelper.getValueFromObject(bodyParams, 'material_group_attribute', [])
    const idUpdate = apiHelper.getValueFromObject(bodyParams, 'material_group_id', null)
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      const materialGroupID = await request
        .input('MATERIALGROUPID', idUpdate)
        .input('MATERIALGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'material_group_name', null))
        .input('MATERIALGROUPCODE', apiHelper.getValueFromObject(bodyParams, 'material_group_code', null))
        .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'material_group_parent', null))
        .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
        .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'updated_user', null))
        .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_CREATEORUPDATE_ADMINWEB);
      if (!materialGroupID.recordset[0]['RESULT']) {
        throw  new Error("Lỗi! Tạo | Sửa nhóm thiết bị thất bại");
      }
      if (idUpdate) {
        //Xóa tham chiếu
        const requestDel = new sql.Request(transaction);
        await requestDel
          .input('MATERIALGROUPID', idUpdate)
          .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_ATTRIBUTE_DELETE_ADMINWEB);
      }
      for (let i = 0; i < listAttribute.length; i++) {
        const request2 = new sql.Request(transaction);
        await request2
          .input('MATERIALGROUPID', materialGroupID.recordset[0]['RESULT'])
          .input('ATTRIBUTEID', listAttribute[i]?.value)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'updated_user', null))
          .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_ATTRIBUTE_CREATEORUPDATE_ADMINWEB);
      }
      await transaction.commit();
      return new ServiceResponse(true, 'Thêm nhóm nguyên liệu thành công', {});

    } catch (error) {
      await transaction.rollback();
      logger.error(error, {function: 'MaterialGroupService.createOrUpdate'});
      return new ServiceResponse(false, error.message);
    }
  }
;

const getListMaterialGroup = async (params = {}) => {
  try {

    const pool = await mssql.pool;
    const materialGroups = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
      .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
      .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
      .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_GETLIST_ADMINWEB);
    return {
      list: materialGroupClass.list(materialGroups.recordsets[0]),
      total: materialGroups.recordsets[0][0]['TOTALITEMS'],
    };
  } catch (error) {
    logger.error('MaterialGroupService.getList', error);
    return [];
  }
};

const getById = async materialGroupId => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('MATERIALGROUPID', materialGroupId)
      .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_GETBYID_ADMINWEB);
    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy nhóm nguyên liệu');
    }
    const result = {
      ...materialGroupClass.detail(data.recordsets[0][0]),
      material_group_attribute: materialGroupClass.detailAttribute(data.recordsets[1]) || []
    }
    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, {function: 'MaterialGroupService.getById'});
    return new ServiceResponse(false, error.message);
  }
};

const deleteMaterialGroup = async (materialGroupId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('MATERIALGROUPID', materialGroupId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_DELETE_ADMINWEB);
    return new ServiceResponse(true, 'Delete material group successfully!');
  } catch (e) {
    logger.error(e, {function: 'MaterialGroupService.deleteMaterialGroup'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteListMaterialGroup = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'MATERIALGROUPID')
      .input('TABLENAME', 'MTR_MATERIALGROUP')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, {function: 'MaterialGroupService.deleteListMaterialGroup'});
    return new ServiceResponse(false, 'Lỗi xoá danh sách nhóm thiết bị');
  }
};

const getOptionTreeView = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
      .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_GETOPTIONSCREATE_ADMINWEB);
    return new ServiceResponse(true, '', materialGroupClass.options(data.recordset));
  } catch (e) {
    logger.error(e, {function: 'MaterialGroupService.getOptionTreeView'});
    return [];
  }
};


const generateCode = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PREFIX', apiHelper.getValueFromObject(queryParams, 'prefix'))
      .execute(PROCEDURE_NAME.MTR_MATERIALGROUP_GENERATECODE_ADMINWEB);
    return new ServiceResponse(true, '', {code: data.recordset[0]['RESULT'] || null});
  } catch (e) {
    logger.error(e, {function: 'MaterialGroupService.generateCode'});
    return [];
  }
};
module.exports = {
  createOrUpdateHandler,
  getListMaterialGroup,
  getById,
  deleteMaterialGroup,
  deleteListMaterialGroup,
  getOptionTreeView,
  generateCode
}
