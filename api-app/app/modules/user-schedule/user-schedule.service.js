const userScheduleClass = require("./user-schedule.class");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const apiHelper = require("../../common/helpers/api.helper");
const mssql = require("../../models/mssql");
const sql = require("mssql");
const ServiceResponse = require("../../common/responses/service.response");
const logger = require("../../common/classes/logger.class");
const fileHelper = require("../../common/helpers/file.helper");
const config = require("../../../config/config");
const moment = require('moment');


const getOptionCompany = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute("HR_USER_SCHEDULE_GetOptionCompany_WebAdmin");
    const data_company = userScheduleClass.listCompany(data.recordsets[0]);
    const data_shift = userScheduleClass.listShift(data.recordsets[1])
    return new ServiceResponse(true, "", { data_company: data_company, data_shift: data_shift });
  } catch (e) {
    logger.error(e, { function: "scheduleService.getListOptionCompany" });
    return new ServiceResponse(false, "", {});
  }
};
const getOptionBusiness = async (company_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('COMPANYID', company_id)
      .execute("HR_USER_SCHEDULE_GetBusinessWithCompanyId_WebAdmin");
    const data_business = userScheduleClass.listBusiness(data.recordsets[0]);
    const data_department = userScheduleClass.listDepartment(data.recordsets[1]);

    return new ServiceResponse(true, "", { data_business: data_business, data_department: data_department });
  } catch (e) {
    logger.error(e, { function: "scheduleService.getListOptionBusiness" });
    return new ServiceResponse(false, "", {});
  }
};
const getOptionStore = async (business_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('BUSINESSID', business_id)
      .execute("HR_USER_SCHEDULE_GetOptionStoreWithBusinessId_WebAdmin");
    const data_store = userScheduleClass.listStore(data.recordsets[0]);
    const data_user = userScheduleClass.listUser(data.recordsets[1]);

    return new ServiceResponse(true, "", { data_store: data_store, data_user: data_user });
  } catch (e) {
    logger.error(e, { function: "scheduleService.getListOptionStore" });
    return new ServiceResponse(false, "", {});
  }
};
// lấy danh sách phân ca làm việc
const getListUserSchedule = async (queryParams) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('STROREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
      .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
      .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
      .input('CREATEDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
      .input('CREATEDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
      .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
      .execute("HR_USER_SCHEDULE_GetList_AdminWeb");
    const result_user_schedule = userScheduleClass.listSchedule(data.recordsets[0]);
    const result_shift = data.recordsets[1];
    const result_store = data.recordsets[2];
    const result_department = data.recordsets[3];

    // get min date max date
    for (let i = 0; i < result_user_schedule.length; i++) {
      const data_minMax = await pool
        .request()
        .input('STROREID', result_user_schedule[i].store_id)
        .input('SHIFTID', result_user_schedule[i].shift_id)
        .input('CREATEDDATE', result_user_schedule[i].date_create)
        .input('USERNAME', result_user_schedule[i].user_name)
        .execute("HR_USER_SCHEDULE_GetDateMinMax_AdminWeb");
      const resMinMax = userScheduleClass.minMaxTime(data_minMax.recordset[0]);
      result_user_schedule[i].shift_date = resMinMax.min_date + ' - ' + resMinMax.max_date;
      result_user_schedule[i].min_date = resMinMax.min_date;
      result_user_schedule[i].max_date = resMinMax.max_date;
    }


    return new ServiceResponse(true, '', {
      data: result_user_schedule,
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(data.recordsets[4]),
      data_shift: userScheduleClass.listShift(result_shift),
      data_store: userScheduleClass.listStore(result_store),
      data_department: userScheduleClass.listDepartment(result_department),
    });

  } catch (e) {
    logger.error(e, { function: "scheduleService.getListOptionStore" });
    return new ServiceResponse(false, "", {});
  }
};


// tạo phân ca làm việc
const createUserSchedule = async (body) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const data_shift = await pool
      .request()
      .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
      .execute("HR_USER_SCHEDULE_GetDateWork_AdminWeb");
    const dateWeek = userScheduleClass.timeWordInWeek(data_shift.recordset[0]);
    let from_date = moment(body.date_from, 'DD/MM/YYYY')
    let to_date = moment(body.date_to, 'DD/MM/YYYY');
    const about_date = to_date.diff(from_date, 'days');
    let data_user_apply = [];
    // lấy list nhân viên của phòng ban trong  công ty
    if (body.data_department.length > 0) {
      for (let i = 0; i < body.data_department.length; i++) {
        const data_user = await pool
          .request()
          .input('BUSINESSID', body.business_id)
          .input('DEPARTMENTID', body.data_department[i].department_id)
          .execute("HR_USER_SCHEDULE_GetUserDepartment_AdminWeb");
        const user_respone = userScheduleClass.listUser(data_user.recordset);
        console.log({user_respone})
        data_user_apply = [...data_user_apply,...user_respone];
      }
    }
    // console.log({data_user_apply})
    if (body.data_user.length > 0) {
      for (let i = 0; i < body.data_user.length; i++) {
        const findIndex = data_user_apply.findIndex((item) => item.user_name == body.data_user[i].user_name)
        if (findIndex == -1) {
          data_user_apply.push(body.data_user[i])
        }
      }
    }

    for (let i = 0; i <= about_date; i++) {
      for (let j = 0; j < data_user_apply.length; j++) {
        const shift_date = moment(from_date, 'DD/MM/YYYY').add(i, 'days').format('YYYY-MM-DD');
        if (dateWeek[moment(shift_date).format('dddd')]) {
          const requestSchedule = new sql.Request(transaction);
          const resultSchedule = await requestSchedule
            .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
            .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
            .input('USERNAME', data_user_apply[j].user_name)
            .input('SHIFTDATE', shift_date)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('HR_USER_SCHEDULE_createMultiSchedule_AdminWeb');
          const user_schedule_id = resultSchedule.recordset[0].RESULT;
          if (!user_schedule_id) {
            await transaction.rollback();
          }
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, "");
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "scheduleService.createUserschedule" });
    return new ServiceResponse(false, "", {});
  }
}

const updateDetailUserSchedule = async (body) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const requestDelete = new sql.Request(transaction);
    const resultDelete = await requestDelete
      .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
      .input('STROREID', apiHelper.getValueFromObject(body, 'store_id'))
      .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
      .input('CREATEDATEFROM', moment(new Date()).format('DD/MM/YYYY'))
      .input('DELETEUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('HR_USER_SCHEDULE_DeleteAllSchedule_AdminWeb');
    const delete_schedule_id = resultDelete.recordset[0].RESULT;
    if (!delete_schedule_id) {
      await transaction.rollback();
    }

    // -- tạo mới hoặc update ca làm việc mới--

    // lấy ngày làm việc trong tuần
    const data_shift = await pool
      .request()
      .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
      .execute("HR_USER_SCHEDULE_GetDateWork_AdminWeb");
    const dateWeek = userScheduleClass.timeWordInWeek(data_shift.recordset[0]);
    let from_date = moment(body.min_date, 'DD/MM/YYYY')
    let to_date = moment(body.max_date, 'DD/MM/YYYY');
    const about_date = to_date.diff(from_date, 'days');

    // thêm ca hoặc update phân ca làm việc mới
    for (let i = 0; i <= about_date; i++) {
      const shift_date = moment(from_date, 'DD/MM/YYYY').add(i, 'days').format('YYYY-MM-DD');
      if (dateWeek[moment(shift_date).format('dddd')]) {
        const requestSchedule = new sql.Request(transaction);
        const resultSchedule = await requestSchedule
          .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
          .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
          .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
          .input('SHIFTDATE', shift_date)
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute('HR_USER_SCHEDULE_createMultiSchedule_AdminWeb');
        const user_schedule_id = resultSchedule.recordset[0].RESULT;
        if (!user_schedule_id) {
          await transaction.rollback();
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, "");
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "scheduleService.updateDetail" });
    return new ServiceResponse(false, "", {});
  }
}

const deleteUserSchedule = async (body) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    await transaction.begin();
    const requestSchedule = new sql.Request(transaction);
    const resultSchedule = await requestSchedule
      .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
      .input('STROREID', apiHelper.getValueFromObject(body, 'store_id'))
      .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
      .input('DELETEUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('HR_USER_SCHEDULE_DeleteSchedule_AdminWeb');
    const user_schedule_id = resultSchedule.recordset[0].RESULT;
    if (!user_schedule_id) {
      await transaction.rollback();
    }
    await transaction.commit();
    return new ServiceResponse(true, "");
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "scheduleService.updateDetail" });
    return new ServiceResponse(false, "", {});
  }
}

module.exports = {
  getOptionCompany,
  getOptionBusiness,
  getOptionStore,
  createUserSchedule,
  getListUserSchedule,
  updateDetailUserSchedule,
  deleteUserSchedule
};
