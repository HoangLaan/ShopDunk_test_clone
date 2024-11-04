const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const BudgetRvLvClass = require('./borrow-request-lv.class.js');
const ServiceResponse = require('../../common/responses/service.response');


const createOrUpdateHandler = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const idUpdate = apiHelper.getValueFromObject(bodyParams, 'borrow_review_level_id', null);
    const listDepartment = apiHelper.getValueFromObject(bodyParams, 'departments', []);
    const listPosition = apiHelper.getValueFromObject(bodyParams, 'positions', []);
    const isApplyAll = (listDepartment).some(obj => obj.id === -1);
    const borrowRvLevelName = apiHelper.getValueFromObject(bodyParams, 'borrow_review_level_name', null)
    const companyID = apiHelper.getValueFromObject(bodyParams, 'company_id', []);
    const request = new sql.Request(transaction);
    const result = await request
      .input('BORROWREVIEWLEVELNAME', borrowRvLevelName)
      .input('COMPANYID', companyID)
      .input('ISAPPLYALLDEPARTMENT', isApplyAll)
      .input('ISAPPLYALLPOSITION', isApplyAll)
      .input('CREATEDUSER', idUpdate ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '') : apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
      .execute(PROCEDURE_NAME.SL_BORROWREVIEWLEVEL_CREATEORUPDATE_ADMINWEB);
    const reviewLvId = result.recordset[0]['RESULT']

    if (!reviewLvId)
      throw new Error("insert borrow review level failed!")

    if (!isApplyAll) {
      for (let i = 0; i < listDepartment.length; i++) {
        for (let j = 0; j < listPosition[i].length; j++) {
          const request2 = new sql.Request(transaction);
          await request2
            .input('BORROWREVIEWLEVELID', reviewLvId)
            .input('DEPARTMENTID', listDepartment[i]?.id)
            .input('POSITIONID', listPosition[i][j]?.id)
            .input('CREATEDUSER', idUpdate ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '') : apiHelper.getValueFromObject(bodyParams, 'created_user', ''))
            .execute(PROCEDURE_NAME.SL_BORROWREVIEWLEVEL_APPLY_DEPARTMENT_CREATE_ADMINWEB);
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, 'Thêm mức duyệt thành công', {});
  } catch (error) {
    await transaction.rollback();
    logger.error(error, {function: 'BorrowRequestLvService.createOrUpdate'});
    return new ServiceResponse(false, error.message);
  }
};

const getListBorrowRequestLv = async (params = {}) => {
  try {
    const pool = await mssql.pool;
    const list = await pool
      .request()
      .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id', null))
      .execute(PROCEDURE_NAME.SL_BORROWREVIEWLEVEL_GETLIST_ADMINWEB);
    const data = BudgetRvLvClass.list(list.recordsets[0])
    return {list: data};
  } catch (error) {
    logger.error('BorrowRequestLvService.getList', error);
    return {list: []}
  }
};

const getListUserReview = async (borrowRLId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BORROWREVIEWLEVELID', borrowRLId)
      .execute(PROCEDURE_NAME.SL_BORROWREVIEWLEVEL_GETUSERREVIEW_ADMINWEB);
    let borrowRL = BudgetRvLvClass.options(data.recordset);
    return new ServiceResponse(true, '', borrowRL);
  } catch (e) {
    logger.error(e, {'function': 'BorrowRequestLvService.getListUserReview'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  createOrUpdateHandler,
  getListBorrowRequestLv,
  getListUserReview
}
