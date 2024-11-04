const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const BudgetRvLvClass = require('./budget-review-lv.class.js');
const ServiceResponse = require('../../common/responses/service.response');


const createOrUpdateHandler = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const idUpdate = apiHelper.getValueFromObject(bodyParams, 'budget_review_level_id', null);
    const listDepartment = apiHelper.getValueFromObject(bodyParams, 'departments', []);
    const listPosition = apiHelper.getValueFromObject(bodyParams, 'positions', []);
    const isApplyAllDepartment = (listDepartment).some(obj => obj.id === -1);
    const isApplyAllPosition = (listPosition).flat().some(obj => obj.id === -1);
    const budgetRvLevelName = apiHelper.getValueFromObject(bodyParams, 'budget_review_level_name', null)
    const companyID = apiHelper.getValueFromObject(bodyParams, 'company_id', []);
    const request = new sql.Request(transaction);
    const result = await request
      .input('BUDGETREVIEWLEVELID', idUpdate)
      .input('BUDGETREVIEWLEVELNAME', budgetRvLevelName)
      .input('COMPANYID', companyID)
      .input('ISAPPLYALLDEPARTMENT', isApplyAllDepartment)
      .input('ISAPPLYALLPOSITION', isApplyAllPosition)
      .input('CREATEDUSER', idUpdate ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '') : apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
      .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLEVEL_CREATEORUPDATE_ADMINWEB);
    const reviewLvId = result.recordset[0]['RESULT']

    if (!reviewLvId)
      throw new Error("insert budget review level failed!")

    if (!isApplyAllDepartment) {
      for (let i = 0; i < listDepartment.length; i++) {
        for (let j = 0; j < listPosition[i].length; j++) {
          const request2 = new sql.Request(transaction);
          await request2
            .input('BUDGETREVIEWLEVELID', reviewLvId)
            .input('DEPARTMENTID', listDepartment[i]?.id)
            .input('POSITIONID', listPosition[i][j]?.id)
            .input('CREATEDUSER', idUpdate ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '') : apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
            .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLEVEL_APPLY_DEPARTMENT_CREATRE_ADMINWEB);
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, 'Thêm mức duyệt thành công', {});
  } catch (error) {
    await transaction.rollback();
    logger.error(error, {function: 'BudgetReviewLvService.createOrUpdate'});
    return new ServiceResponse(false, error.message);
  }
};

const getListBudgetReviewLv = async (params = {}) => {
  try {
    const pool = await mssql.pool;
    const list = await pool
      .request()
      .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id', null))
      .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLEVEL_GETLIST_ADMINWEB);
    const data = BudgetRvLvClass.list(list.recordsets[0])
    return {list: data};
  } catch (error) {
    logger.error('BudgetReviewLvService.getList', error);
    return {list: []}
  }
};

const getListUserReview = async (budgetRLId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BUDGETREVIEWLEVELID', budgetRLId)
      .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLEVEL_GETUSERREVIEW_ADMINWEB);
    let budgetRL = BudgetRvLvClass.options(data.recordset);
    return new ServiceResponse(true, '', budgetRL);
  } catch (e) {
    logger.error(e, {'function': 'BudgetReviewLvService.getListUserReview'});
    return new ServiceResponse(false, e.message);
  }
};


const deleteBudgetReviewLv = async (id,bodyParams)=> {
  try {
    console.log(id)
    const pool = await mssql.pool;
    await pool
      .request()
      .input('BUDGETREVIEWLEVELID', id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLEVEL_DELETE_ADMINWEB);
    return new ServiceResponse(true,'delete budget type successfully!');
  } catch (e) {
    logger.error(e, { function: 'BudgetTypeService.deleteBudgetType' });
    return new ServiceResponse(false, e.message);
  }
};
module.exports = {
  createOrUpdateHandler,
  getListBudgetReviewLv,
  getListUserReview,
  deleteBudgetReviewLv
}
