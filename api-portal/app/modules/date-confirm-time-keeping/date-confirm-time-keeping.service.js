const timeKeepingDateConfirmClass = require('./date-confirm-time-keeping.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
let xl = require('excel4node');
const moment = require('moment');

/**
 * @param queryParams
 * @returns ServiceResponse
 */
const getListTimeKeepingDateConfirm = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('TIMEKEEPINGCONFIRMDATEID', apiHelper.getValueFromObject(queryParams, 'time_keeping_confirm_date_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('BEGINDATE', apiHelper.getValueFromObject(queryParams, 'date_from'))
      .input('ENDATE', apiHelper.getValueFromObject(queryParams, 'date_to'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISACTIVE', Number(apiHelper.getFilterBoolean(queryParams, 'is_active')))
      .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_showweb'))
      .execute('MD_TIMEKEEPINGCONFIRMDATE_GetList_AdminWeb');

    let products = [];
    let totalItem = 0;
    let list_apply = '';


    if (data.recordset && data.recordset.length > 0) {
      dataRecord = data.recordset;
      totalItem = data.recordset ? data.recordset[0].TOTAL : 0;
      products = timeKeepingDateConfirmClass.list(dataRecord);
      return new ServiceResponse(true, '', {
        items: products,
        page: currentPage,
        itemsPerPage: itemsPerPage,
        totalItems: totalItem,
        totalPages: Math.ceil(totalItem / itemsPerPage)
      });
    } else {
      return new ServiceResponse(true, '', {
        items: products,
        page: currentPage,
        itemsPerPage: itemsPerPage,
        totalItems: totalItem,
        totalPages: Math.ceil(totalItem / itemsPerPage)
      });
    }
  } catch (error) {
    logger.error(e, {
      function: 'TimeKeepingDateConfirmService.getTimeKeepingDateConfirm',
    });
    return new ServiceResponse(false, e.message);
  }
};

const timeKeepingDateConfirmCreateOrUpdate = async bodyParams => {
  let obj_date_from = apiHelper.getValueFromObject(bodyParams, 'date_from');
  let obj_date_to = apiHelper.getValueFromObject(bodyParams, 'date_to');
  let listMonth = apiHelper.getValueFromObject(bodyParams, 'listMonth');
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  let time_keeping_date_confirm_id ;
  try{
    await transaction.begin();
    for (let i = 0; i < listMonth.length; i++) {
      let date_from = moment(`${listMonth[i]}-${obj_date_from}`, 'MM-DD-YYYY').format('YYYY-MM-DD');
      let date_to = moment(`${listMonth[i]}-${obj_date_to}`, 'MM-DD-YYYY').format('YYYY-MM-DD');
      try{
        const request = new sql.Request(transaction);
        const result = await request
        .input('TIMEKEEPINGCONFIRMDATEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_confirm_date_id'))
        .input('TIMEKEEPINGCONFIRMDATENAME', apiHelper.getValueFromObject(bodyParams, 'time_keeping_confirm_date_name'))
        .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'time_keeping_date_description'))
        .input('BEGINDATE', date_from)
        .input('ENDDATE', date_to)
        .input('ISALL', apiHelper.getValueFromObject(bodyParams, 'is_apply_year'))
        .input('ISJAN', listMonth[i] === 1 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_jan'):0)
        .input('ISFED', listMonth[i] === 2 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_Feb'):0)
        .input('ISMAR', listMonth[i] === 3 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_mar'):0)
        .input('ISAPR', listMonth[i] === 4 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_apr'):0)
        .input('ISMAY', listMonth[i] === 5 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_may'):0)
        .input('ISJUN', listMonth[i] === 6 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_jun'):0)
        .input('ISJULY', listMonth[i] === 7 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_july'):0)
        .input('ISAUG', listMonth[i] === 8 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_aug'):0)
        .input('ISSEP', listMonth[i] === 9 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_sep'):0)
        .input('ISOCT', listMonth[i] === 10 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_oct'):0)
        .input('ISNOV', listMonth[i] === 11 ? apiHelper.getValueFromObject(bodyParams, 'is_apply_nov'):0)
        .input('ISDEC', listMonth[i] === 11 ?apiHelper.getValueFromObject(bodyParams, 'is_apply_dec'):0)
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('MD_TIMEKEEPINGCONFIRMDATE_CreateOrUpdate_AdminWeb');
        time_keeping_date_confirm_id = result.recordset[0].RESULT;
        if (!time_keeping_date_confirm_id) {
          await transaction.rollback();
        }
      }catch(e){
        console.log(e.message);
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', {
      time_keeping_date_confirm_id,
    });
  }catch(e){
    await transaction.rollback();
    logger.error(e, {
      function: 'TimeKeepingDateConfirmService.createOrUpateTimeKeepingDateConfirm',
    });
    return new ServiceResponse(false, e.message);
  } 
};

/**
 * @param queryParams
 * @returns ServiceResponse
 */
const getTimeKeepingDateConfirm = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('TIMEKEEPINGCONFIRMDATEID', apiHelper.getValueFromObject(queryParams, 'time_keeping_confirm_date_id'))
      .execute('MD_TIMEKEEPINGCONFIRMDATE_GetOption_AdminWeb');
    let resultDetail = data && data.recordset && data.recordset.length > 0 && data.recordset[0]
    let resultListMonthExists = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1] && data.recordsets[1].length > 0 && data.recordsets[1][0];

    let dataRecord = timeKeepingDateConfirmClass.items(resultDetail);
    let dataListMonth = timeKeepingDateConfirmClass.listMonth(resultListMonthExists)



    return new ServiceResponse(true, '', {...dataRecord , ...dataListMonth });
  } catch (e) {
    logger.error(e, {function: 'timeKeepingDateConfirm.getTimeKeepingDateConfirm'});
    return [];
  }
};



/**
 * @param queryParams
 * @returns ServiceResponse
 */
 const getMonthApplyTimeKeeping = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('MD_TIMEKEEPINGCONFIRMDATE_GetMonthApply_AdminWeb');
    let dataRecord = data.recordset[0];
    return new ServiceResponse(true, '', timeKeepingDateConfirmClass.listMonth(dataRecord));
  } catch (e) {
    logger.error(e, {function: 'timeKeepingDateConfirm.getMonthApplyTimeKeeping'});
    return [];
  }
};


const CheckTimeKeepingDateConfirm = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('MD_TIMEKEEPINGCONFIRMDATE_CheckDate_AdminWeb');
    let dataRecord = timeKeepingDateConfirmClass.checkDate(data.recordset[0]);
    let obj = {
      time_keeping_confirm_date_id : null,
      date_from : null,
      date_to : null,
      is_close: false
    }
    return new ServiceResponse(true, '', {...obj ,...dataRecord});
  } catch (e) {
    logger.error(e, {function: 'timeKeepingDateConfirm.CheckDateConfirmDate'});
    return [];
  }
};


const deleteTimeKeepingDateConfirm = async (time_keeping_confirm_date_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('TIMEKEEPINGCONFIRMDATEID', time_keeping_confirm_date_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_TIMEKEEPINGCONFIRMDATE_Delete_AdminWeb');
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'timeKeepingDateConfirm.deleteTimeKeepingDateConfirm',
    });
    return new ServiceResponse(false, e.message);
  }
};

const deleteTimeKeepingDateConfirmList = async (bodyParams) => {
    try {
      const pool = await mssql.pool;
      await pool
        .request()
        .input('TIMEKEEPINGCONFIRMDATEIDS', apiHelper.getValueFromObject(bodyParams, 'list_id'))
        .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('MD_TIMEKEEPINGCONFIRMDATE_DeleteList_AdminWeb');
      return new ServiceResponse(true);
    } catch (e) {
      logger.error(e, {
        function: 'timeKeepingDateConfirm.deleteTimeKeepingDateConfirm',
      });
      return new ServiceResponse(false, e.message);
    }
  };

module.exports = {
  getListTimeKeepingDateConfirm,
  timeKeepingDateConfirmCreateOrUpdate,
  getTimeKeepingDateConfirm,
  deleteTimeKeepingDateConfirm,
  CheckTimeKeepingDateConfirm,
  getMonthApplyTimeKeeping,
  deleteTimeKeepingDateConfirmList
};
