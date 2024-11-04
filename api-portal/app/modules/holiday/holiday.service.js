const HolidayClass = require('./holiday.class');
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
const getListHoliday = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('HOLIDAYID', apiHelper.getValueFromObject(queryParams, 'holiday_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'date_from'))
      .input('ENDATE', apiHelper.getValueFromObject(queryParams, 'date_to'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISACTIVE', Number(apiHelper.getFilterBoolean(queryParams, 'is_active')))
      .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_showweb'))
      .execute('MD_HOLIDAY_GetList_AdminWeb');

    let ListHoliday = [];
    let totalItem = 0;
    let list_apply = '';
    if (data.recordset && data.recordset.length > 0) {
      dataRecord = data.recordset;
      totalItem = data.recordset ? data.recordset[0].TOTAL : 0;
      ListHoliday = HolidayClass.list(dataRecord);

      //itemsPerPage, page, totalItems, totalPages 

      return new ServiceResponse(true, '', {
        items: ListHoliday,
        page: currentPage,
        itemsPerPage: itemsPerPage,
        totalItems: totalItem,
        totalPages: Math.ceil(totalItem / itemsPerPage)
      });
    } else {
      return new ServiceResponse(true, '', {
        items: ListHoliday,
        page: currentPage,
        itemsPerPage: itemsPerPage,
        totalItems: totalItem,
        totalPages: Math.ceil(totalItem / itemsPerPage)
      });
    }
  } catch (error) {
    logger.error(e, {
      function: 'HolidayService.getListHoliday',
    });
    return new ServiceResponse(false, e.message);
  }
};

const HolidayCreateOrUpdate = async bodyParams => {
  let date_from = moment(apiHelper.getValueFromObject(bodyParams, 'date_from'), 'DD/MM/YYYY').format('YYYY-MM-DD');
  let date_to = moment(apiHelper.getValueFromObject(bodyParams, 'date_to'), 'DD/MM/YYYY').format('YYYY-MM-DD');
  try {
    const pool = await mssql.pool;

    const checkNameExists = await pool
    .request()
    .input('HOLIDAYID', apiHelper.getValueFromObject(bodyParams, 'holiday_id'))
    .input('HOLIDAYNAME', apiHelper.getValueFromObject(bodyParams, 'holiday_name'))
    .execute('MD_HOLIDAY_CheckNameExists_AdminWeb');
    let is_exists_name = checkNameExists && checkNameExists.recordset && checkNameExists.recordset.length > 0 ? checkNameExists.recordset[0].RESULT : null;
    if(is_exists_name){
        return new ServiceResponse(false, 'Tên ngày lễ tết đã tồn tại', {message:'Tên ngày lễ tết đã tồn tại'});
    }else{
        const data = await pool
        .request()
        .input('HOLIDAYID', apiHelper.getValueFromObject(bodyParams, 'holiday_id'))
        .input('HOLIDAYNAME', apiHelper.getValueFromObject(bodyParams, 'holiday_name'))
        .input('STARTDATE', date_from)
        .input('ENDDATE', date_to)
        .input('TOTALDAY', apiHelper.getValueFromObject(bodyParams, 'total_day'))
        .input('ISAPPLYWORKDAY', apiHelper.getValueFromObject(bodyParams, 'is_apply_work_day'))
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('MD_HOLIDAY_CreateOrUpdate_AdminWeb');
      let holiday_id = data && data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null;
      if (!holiday_id || !data.recordset) {
        // return new ServiceResponse(false,  RESPONSE_MSG.MODEL.UPDATE_FAILED);
        return new ServiceResponse(false, '', {
          holiday_id,
          status: 'error',
          message: "Đã xảy ra lỗi khi tạo mới hoặc cập nhật"
        });
      }
      if (holiday_id == 'Error_1') {
        return new ServiceResponse(false, '', {
          holiday_id,
          status: 'error',
          message: 'Ngày lễ bị trùng hoặc đã tồn tại !'
        });
      }
      return new ServiceResponse(true, '', {
        holiday_id,
        status: 'success',
        message: 'Lưu thành công!'
      });
    }
  } catch (e) {
    // console.log(e.message)
    logger.error(e, {
      function: 'HolidayService.createOrUpateRange',
    });
    return new ServiceResponse(false, e.message);
  }
};

//const shift_date = moment(from_date, 'DD/MM/YYYY').add(i, 'days').format('YYYY-MM-DD');

/**
 * @param queryParams
 * @returns ServiceResponse
 */
const getHoliday = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('HOLIDAYID', apiHelper.getValueFromObject(queryParams, 'holiday_id'))
      .execute('MD_HOLIDAY_GetDetail_AdminWeb');
    let dataRecord = data.recordset[0];
    return new ServiceResponse(true, '', HolidayClass.items(dataRecord));
  } catch (e) {
    logger.error(e, { function: 'HolidayService.getHoliday' });
    return [];
  }
};

const deleteHoliday = async (holiday_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('HOLIDAYID', holiday_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_HOLIDAY_DeleteById_AdminWeb');
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'HolidayService.deleteHoliday',
    });
    return new ServiceResponse(false, e.message);
  }
};

const deleteHolidayList = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('HOLIDAYIDS', apiHelper.getValueFromObject(bodyParams, 'list_id'))
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_HOLIDAY_DeleteListById_AdminWeb');
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'HolidayService.deleteHoliday',
    });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListHoliday,
  HolidayCreateOrUpdate,
  getHoliday,
  deleteHoliday,
  deleteHolidayList
};
