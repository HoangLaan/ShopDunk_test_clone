const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const BudgetTypeClass = require('./budget-type.class')
const ServiceResponse = require('../../common/responses/service.response');

const createOrUpdateHandler = async (bodyParams = {}) => {
  const idUpdate = apiHelper.getValueFromObject(bodyParams, 'budget_type_id', null)
  const pool = await mssql.pool;
  const validation = await pool
    .request()
    .input('BUDGETTYPEID', idUpdate)
    .input('BUDGETTYPENAME', apiHelper.getValueFromObject(bodyParams, 'budget_type_name', null))
    .input('BUDGETTYPECODE', apiHelper.getValueFromObject(bodyParams, 'budget_type_code', null))
    .execute(PROCEDURE_NAME.FI_BUDGETTYPE_CHECKVALIDATION_ADMINWEB);
  if(!validation.recordset[0]["RESULT"])
    return new ServiceResponse(false,validation.recordset[0]["MESSAGE"]);
  const transaction = await new sql.Transaction(pool);
  const isAutoReview = apiHelper.getValueFromObject(bodyParams, 'is_auto_review', null)
  const listReviewLevel = apiHelper.getValueFromObject(bodyParams, 'budget_type_review_list', [])

  try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      const budgetTypeID = await request
        .input('BUDGETTYPEID', idUpdate)
        .input('BUDGETTYPENAME', apiHelper.getValueFromObject(bodyParams, 'budget_type_name', null))
        .input('BUDGETTYPECODE', apiHelper.getValueFromObject(bodyParams, 'budget_type_code', null))
        .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id', null))
        .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id', null))
        .input('EFFECTIVETIME', apiHelper.getValueFromObject(bodyParams, 'effective_time', null))
        .input('ISAUTOREVIEW', isAutoReview)
        .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
        .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'notes', null))
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
        .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'updated_user', null))
        .execute(PROCEDURE_NAME.FI_BUDGETTYPE_CREATEORUPDATE_ADMINWEB);
      if (!isAutoReview && !listReviewLevel.length) {
        throw  new Error("Lỗi! Không có thông tin duyệt");
      } else {
        if (!isAutoReview) {
          if (idUpdate) {
            //Xóa tham chiếu
            const requestDel = new sql.Request(transaction);
            await requestDel
              .input('BUDGETTYPEID', idUpdate)
              .execute(PROCEDURE_NAME.FI_BUDGETTYPE_REVIEWLEVEL_DELETE_ADMINWEB);
          }
          for (let i = 0; i < listReviewLevel.length; i++) {
            const request2 = new sql.Request(transaction);
            const budgetTypeRvLvId = await request2
              .input('BUDGETTYPEREVIEWLEVELID', listReviewLevel[i]?.budget_type_review_level_id || null)
              .input('BUDGETTYPEID', budgetTypeID.recordset[0]['RESULT'])
              .input('BUDGETREVIEWLEVELID', listReviewLevel[i]?.budget_review_level_id)
              .input('ISAUTOREVIEW', listReviewLevel[i]?.is_auto_review)
              .input('BUDGETLEVELFROM', listReviewLevel[i]?.budget_level_from)
              .input('BUDGETLEVELTO', listReviewLevel[i]?.budget_level_to)
              .input('ISCOMPLETE', listReviewLevel[i]?.is_complete_review)
              .execute(PROCEDURE_NAME.FI_BUDGETTYPE_REVIEWLEVEL_CREATEORUPDATE_ADMINWEB);
            const userReview = listReviewLevel[i]?.user
            if (!listReviewLevel[i]?.is_auto_review && !userReview)
              throw  new Error("Lỗi! Không có thông tin người duyệt");
            else {
              if (!listReviewLevel[i]?.is_auto_review) {
                const request3 = new sql.Request(transaction);
                const s3 = await request3
                  .input('BUDGETTYPEREVIEWLEVELID', budgetTypeRvLvId.recordset[0]['RESULT'])
                  .input('BUDGETREVIEWLEVELID', listReviewLevel[i]?.budget_review_level_id)
                  .input('USERNAME', listReviewLevel[i]?.user?.id || listReviewLevel[i]?.user)
                  .execute(PROCEDURE_NAME.FI_BUDGETTYPE_REVIEWLEVEL_USER_CREATEORUPDATE_ADMINWEB);
              }
            }
          }
        }
      }
      await transaction.commit();
      return new ServiceResponse(true, 'Thêm loại ngân sách thành công', {});

    } catch (error) {
      await transaction.rollback();
      logger.error(error, {function: 'BudgetTypeService.createOrUpdate'});
      return new ServiceResponse(false, error.message);
    }
  }
;

const getListBudgetType = async (params = {}) => {
  try {

    const pool = await mssql.pool;
    const budgetTypes = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
      .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
      .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
      .execute(PROCEDURE_NAME.FI_BUDGETTYPE_GETLIST_ADMINWEB);
    return {
      list: BudgetTypeClass.list(budgetTypes.recordsets[0]),
      total: budgetTypes.recordsets[0][0]['TOTALITEMS'],
    };
  } catch (error) {
    logger.error('BudgetTypeService.getList', error);
    return [];
  }
};

const getById = async budgetTypeId => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('BUDGETTYPEID', budgetTypeId)
      .execute(PROCEDURE_NAME.FI_BUDGETTYPE_GETBYID_ADMINWEB);
    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy loại ngân sách');
    }
    const result = {
      ...BudgetTypeClass.detail(data.recordsets[0][0]),
      budget_type_review_list: BudgetTypeClass.listReviewLevel(data.recordsets[1]) || []
    }
    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, {function: 'BudgetTypeService.getById'});
    return new ServiceResponse(false, error.message);
  }
};

const deleteBudgetType = async (budgetTypeId,bodyParams)=> {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('BUDGETTYPEID', budgetTypeId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.FI_BUDGETTYPE_DELETE_ADMINWEB);
    return new ServiceResponse(true,'delete budget type successfully!');
  } catch (e) {
    logger.error(e, { function: 'BudgetTypeService.deleteBudgetType' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteListBudgetType = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'BUDGETTYPEID')
      .input('TABLENAME', 'FI_BUDGETTYPE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, {function: 'BudgetTypeService.deleteListBudgetType'});
    return new ServiceResponse(false, 'Lỗi xoá danh sách loại ngân sách');
  }
};

module.exports = {
  createOrUpdateHandler,
  getListBudgetType,
  getById,
  deleteBudgetType,
  deleteListBudgetType
}
