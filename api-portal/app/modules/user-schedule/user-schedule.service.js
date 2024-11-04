const userScheduleClass = require('./user-schedule.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const SingleResponse = require('../../common/responses/single.response');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const moment = require('moment');
let xl = require('excel4node');
const { convertIsReview, convertTimeHourMinutes } = require('./utils/helper');
const getOptionCompany = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('HR_USER_SCHEDULE_GetOptionCompany_AdminWeb');
        const data_company = userScheduleClass.option(data.recordset);
        return new ServiceResponse(true, '', data_company);
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListOptionCompany' });
        return new ServiceResponse(false, '', {});
    }
};
const getOptionBusiness = async (queryParams = {}) => {
    try {
        const user_id =
            apiHelper.getValueFromObject(queryParams, 'user_id') ??
            apiHelper.getValueFromObject(queryParams, 'auth_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('USERID', user_id)
            .execute('HR_USER_SCHEDULE_GetBusinessWithCompanyId_AdminWeb');
        const data_business = userScheduleClass.option(data.recordsets[0]);

        return new ServiceResponse(true, '', data_business);
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListOptionBusiness' });
        return new ServiceResponse(false, '', {});
    }
};
const getOptionStore = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const business = queryParams.business;
        const business_id = business
            ?.map((_) => {
                return _.id;
            })
            .join('|');

        const user_id =
            apiHelper.getValueFromObject(queryParams, 'user_id') ??
            apiHelper.getValueFromObject(queryParams, 'auth_id');
        const data = await pool
            .request()
            .input('BUSINESSID', business_id)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('USERID', user_id)
            .execute('HR_USER_SCHEDULE_GetOptionStoreWithBusinessId_AdminWeb');
        const data_store = userScheduleClass.option(data.recordset);

        return new ServiceResponse(true, '', data_store);
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListOptionStore' });
        return new ServiceResponse(false, '', {});
    }
};
// lấy danh sách phân ca làm việc
const getListUserSchedule = async (queryParams, body) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('ISOVERTIME', apiHelper.getValueFromObject(queryParams, 'is_overtime'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('CREATEDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .execute('HR_USER_SCHEDULE_GetList_AdminWeb');
        let result_user_schedule = userScheduleClass.listSchedule(data.recordsets[0]);
        const result_shift = data.recordsets[1];
        const result_store = data.recordsets[2];
        const result_department = data.recordsets[3];

        const result_business = data.recordsets[4] || [];

        return new ServiceResponse(true, '', {
            items: result_user_schedule,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
            data_shift: userScheduleClass.listShift(result_shift),
            data_store: userScheduleClass.listStore(result_store),
            data_department: userScheduleClass.listDepartment(result_department),
            data_business: userScheduleClass.option(result_business),
        });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListOptionStore' });
        return new ServiceResponse(false, '', {});
    }
};

// tạo phân ca làm việc
const createUserSchedule = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestSchedule = new sql.Request(transaction);
        let list_shift_id = apiHelper.getValueFromObject(body, 'shift');
        let arrayObj = [];

        for (let index = 0; index < list_shift_id.length; index++) {
            const data_shift = await pool // lấy thông tin ca làm việc
                .request()
                .input('SHIFTID', list_shift_id[index].shift_id)
                .execute('HR_USER_SCHEDULE_GetDateWork_AdminWeb');
            const dateWeek = userScheduleClass.timeWordInWeek(data_shift.recordset[0]);

            let from_date = null;
            let to_date = null;
            let about_date = 0;
            if (apiHelper.getValueFromObject(body, 'is_range_date') == 1) {
                from_date = moment(body.date_from, 'DD/MM/YYYY');
                to_date = moment(body.date_to, 'DD/MM/YYYY');
                about_date = to_date.diff(from_date, 'days');
            }

            let data_user_apply = [];
            let data_store_id = apiHelper.getValueFromObject(body, 'store');

            // lấy list nhân viên của phòng ban trong  công ty
            let data_department = apiHelper.getValueFromObject(body, 'department');
            let data_business_id = apiHelper.getValueFromObject(body, 'business');

            if (data_department.length > 0 && data_business_id.length > 0) {
                for (let i = 0; i < data_department.length; i++) {
                    for (let j = 0; j < data_business_id.length; j++) {
                        let item = data_department[i];
                        let itemId = data_business_id[j];
                        const data_user = await pool
                            .request()
                            .input('BUSINESSID', itemId.id)
                            .input('DEPARTMENTID', item.department_id)
                            .execute('HR_USER_SCHEDULE_GetUserDepartment_AdminWeb');
                        let user_respone = userScheduleClass.listUser(data_user.recordset);
                        data_user_apply = [...data_user_apply, ...user_respone];
                    }
                }
            }

            const data_user = apiHelper.getValueFromObject(body, 'user');

            if (data_user.length > 0) {
                for (let i = 0; i < data_user.length; i++) {
                    const findIndex = data_user_apply.findIndex((item) => item.user_name == data_user[i].user_name);
                    if (findIndex == -1) {
                        data_user_apply.push(data_user[i]);
                    }
                }
            }
            let isNull = [];
            let isError;

            const is_pick_date = apiHelper.getValueFromObject(body, 'is_pick_date');

            const pickDate = apiHelper.getValueFromObject(body, 'pickDate');

            if (is_pick_date == 1 && Object.values(pickDate).length) {
                let _pickDate = Object.values(pickDate);
                for (let i = 0; i < _pickDate.length; i++) {
                    let obj = {};

                    for (let k = 0; k < data_store_id.length; k++) {
                        for (let j = 0; j < data_user_apply.length; j++) {
                            const shift_date = moment(_pickDate[i], 'DD/MM/YYYY').format('YYYY-MM-DD');

                            if (!dateWeek[moment(shift_date).format('dddd')]) {
                                isNull.push(shift_date);
                            }
                            if (dateWeek[moment(shift_date).format('dddd')]) {
                                obj = {
                                    schedule_id: apiHelper.getValueFromObject(body, 'schedule_id'),
                                    store_id: data_store_id[k].id,
                                    shift_id: list_shift_id[index].shift_id,
                                    user_name: data_user_apply[j].user_name,
                                    shift_date: shift_date,
                                    created_user: apiHelper.getValueFromObject(body, 'auth_name'),
                                };
                                arrayObj.push(obj);
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i <= about_date; i++) {
                    let obj = {};
                    for (let k = 0; k < data_store_id.length; k++) {
                        for (let j = 0; j < data_user_apply.length; j++) {
                            const shift_date = moment(from_date, 'DD/MM/YYYY').add(i, 'days').format('YYYY-MM-DD');

                            if (!dateWeek[moment(shift_date).format('dddd')]) {
                                isNull.push(shift_date);
                            }
                            if (dateWeek[moment(shift_date).format('dddd')]) {
                                obj = {
                                    schedule_id: apiHelper.getValueFromObject(body, 'schedule_id'),
                                    store_id: data_store_id[k].id,
                                    shift_id: list_shift_id[index].shift_id,
                                    user_name: data_user_apply[j].user_name,
                                    shift_date: shift_date,
                                    created_user: apiHelper.getValueFromObject(body, 'auth_name'),
                                };
                                arrayObj.push(obj);
                            }
                        }
                    }
                }
            }

            if (unique(isNull).length - 1 == about_date) {
                await transaction.rollback();
                return new ServiceResponse(
                    false,
                    'Cảnh báo ca làm việc đang phân không áp dung cho ( Các ngày khai báo trong ca làm việc)',
                );
            }
        }

        for (let i = 0; i < arrayObj.length; i++) {
            try {
                const resultSchedule = await requestSchedule
                    .input('SCHEDULEID', arrayObj[i].schedule_id)
                    .input('STOREID', arrayObj[i].store_id)
                    .input('SHIFTID', arrayObj[i].shift_id)
                    .input('USERNAME', arrayObj[i].user_name)
                    .input('SHIFTDATE', arrayObj[i].shift_date)
                    .input('CREATEDUSER', arrayObj[i].created_user)
                    .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
                    .execute('HR_USER_SCHEDULE_createMultiSchedule_AdminWeb');
                let user_schedule_id =
                    resultSchedule.recordset &&
                    resultSchedule.recordset.length > 0 &&
                    resultSchedule.recordset[0].RESULT
                        ? resultSchedule.recordset[0].RESULT
                        : null;
                isError = user_schedule_id;

                if (!user_schedule_id || !resultSchedule.recordset) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Đã có lỗi xảy ra vui lòng thử lại !');
                }
                if (isError == 'Error_1') {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        'Nhân viên đã được phân ca ở cửa hàng khác vào khoảng thời gian này vui lòng thử lại ! ',
                    );
                } else if (isError == 'Error_2') {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        'Nhân viên đã được phân ca khoảng thời gian này vui lòng thử lại !',
                    );
                } else if (isError == 'Error_3') {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        'Thời gian làm việc của ca này đang bị trùng với ca làm việc trước đó vui lòng thử lại !',
                    );
                } else if (isError == 'Error_4') {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Nhân viên không thuộc cửa hàng này vui lòng thử lại !');
                } else if (isError == 'Error_5' || isError == 'Error_6') {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Đã có lỗi xảy ra vui lòng thử lại !');
                }
            } catch (error) {
                await transaction.rollback();
                logger.error(error, { function: 'scheduleService.createUserschedule' });
                return new ServiceResponse(false, '', {});
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'scheduleService.createUserschedule' });
        await transaction.rollback();
        return new ServiceResponse(false, '', {});
    }
};

const unique = (arr) => {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

const updateDetailUserSchedule = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const shiftList = apiHelper.getValueFromObject(body, 'shift', []);
        if (shiftList?.length > 1) {
            return new ServiceResponse(false, 'Lỗi chỉ được phép cập nhật chọn một phân ca nhân viên');
        }
        // -- tạo mới hoặc update ca làm việc mới--
        const is_range_date = apiHelper.getValueFromObject(body, 'is_range_date');
        const is_pick_date = apiHelper.getValueFromObject(body, 'is_pick_date');
        let data_date = apiHelper.getValueFromObject(body, 'pickDate');

        data_date = Object.values(data_date);

        let from_date = null;
        let to_date = null;

        let about_date = is_pick_date ? data_date.length : null;

        if (is_range_date) {
            from_date = moment(body.date_from, 'DD/MM/YYYY');
            to_date = moment(body.date_to, 'DD/MM/YYYY');
            about_date = to_date.diff(from_date, 'days');
        }

        let isError;
        // thêm ca hoặc update phân ca làm việc mới
        let shift_date = is_pick_date
            ? moment(data_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : moment(from_date, 'DD/MM/YYYY').add(0, 'days').format('YYYY-MM-DD');

        const requestSchedule = new sql.Request(transaction);
        const resultSchedule = await requestSchedule
            .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
            .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('SHIFTID', shiftList[0].shift_id)
            .input('SHIFTDATE', shift_date)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .execute('HR_USER_SCHEDULE_update_MultiSchedule_AdminWeb');

        const user_schedule_id = resultSchedule?.recordset[0]?.RESULT || 0;
        isError = user_schedule_id;
        if (!user_schedule_id) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi cập nhật phân ca nhân viên');
        }
        if (isError == 'Error_1') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Nhân viên đã được phân ca ở cửa hàng khác vào khoảng thời gian này');
        } else if (isError == 'Error_2') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Nhân viên đã được phân ca khoảng thời gian này');
        } else if (isError == 'Error_3') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thời gian làm việc của ca này đang bị trùng với ca làm việc trước đó ');
        } else if (isError == 'Error_4') {
            await transaction.rollback();
            return new ServiceResponse(false, ' Nhân viên không thuộc một trong các miền này vui lòng thử lại !');
        } else if (isError == 'Error_5' || isError == 'Error_6') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Đã có lỗi xảy ra vui lòng thử lại !');
        }

        await transaction.commit();
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'scheduleService.updateDetail' });
        await transaction.rollback();

        return new ServiceResponse(false, '', {});
    }
};

const deleteUserSchedule = async (body) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('STROREID', apiHelper.getValueFromObject(body, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(body, 'shift_id'))
            .input('DELETEUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('SHIFTDATE', apiHelper.getValueFromObject(body, 'shift_date'))
            .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
            .execute('HR_USER_SCHEDULE_DeleteSchedule_AdminWeb');
        // const user_schedule_id =
        //     resultSchedule.recordset && resultSchedule.recordset.length ? resultSchedule.recordset[0]?.RESULT : 0;
        // if (!user_schedule_id) {
        //     return new ServiceResponse(false, 'Lỗi xoá phân ca làm việc', {});
        // }
        return new ServiceResponse(true, 'xoá phân ca làm việc thành công');
    } catch (e) {
        logger.error(e, { function: 'scheduleService.deleteUserSchedule' });
        return new ServiceResponse(false, e.message, {});
    }
};
const reviewUserSchedule = async (body) => {
    try {
        let reviewData = apiHelper.getValueFromObject(body, 'data');

        const pool = await mssql.pool;
        for (let index = 0; index < reviewData.length; index++) {
            const element = reviewData[index];

            const data = await pool
                .request()
                .input('USERSCHEDULE', apiHelper.getValueFromObject(element, 'user_name'))
                .input('STROREID', apiHelper.getValueFromObject(element, 'store_id'))
                .input('SHIFTID', apiHelper.getValueFromObject(element, 'shift_id'))
                .input('CREATEDATEFROM', apiHelper.getValueFromObject(element, 'min_date'))
                .input('CREATEDATETO', apiHelper.getValueFromObject(element, 'max_date'))
                .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
                .input('REVIEWNOTE', apiHelper.getValueFromObject(element, 'note'))
                .input('ISREVIEW', apiHelper.getValueFromObject(element, 'is_review'))
                .execute('HR_USER_SCHEDULE_reviewSchedule_AdminWeb');
            const schedule_id = data.recordset[0].RESULT;

            if (!schedule_id) {
                return new ServiceResponse(false, 'Lỗi duyệt ca làm việc', {});
            }
        }
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'scheduleService.reviewUserSchedule' });
        return new ServiceResponse(false, '', {});
    }
};
const getUserReview = async (shift_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('SHIFTID', shift_id).execute('MD_SHIFT_GetListUserReview_WebAdmin');
        const data_user = userScheduleClass.dataUserReview(data.recordsets[0]);
        return new ServiceResponse(true, '', { data_user });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getUserReview' });
        return new ServiceResponse(false, '', {});
    }
};
const getOptionShiftByStoreId = async (store_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STOREID', store_id).execute('MD_SHIFT_GetListShiftByStoreId_WebAdmin');
        const data_shift = userScheduleClass.listShiftOption(data.recordsets[0]);
        return new ServiceResponse(true, '', { data_shift });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getOptionShiftByStoreId' });
        return new ServiceResponse(false, '', {});
    }
};

const getDetailUserSchedule = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SHIFTDATE', apiHelper.getValueFromObject(queryParams, 'shift_date'))
            .input('SCHEDULEID', apiHelper.getValueFromObject(queryParams, 'schedule_id'))
            .execute('HR_USER_SCHEDULE_GetDetailById_AdminWeb');

        const user_schedule = userScheduleClass.listSchedule(data.recordset[0]);
        const business = userScheduleClass.option(data.recordsets[1]);

        const shift_date = userScheduleClass.shiftDate(data.recordsets[2]);

        const list_shift = userScheduleClass.listShift(data.recordsets[3]);

        const review_list = userScheduleClass.listReview(data.recordsets[4]);

        let _shift_date = {};

        shift_date.map((_shift) => {
            _shift_date[_shift.shift_date] = _shift.shift_date;
        });

        let shift = {};

        list_shift.map((_shift) => {
            shift[_shift.shift_id] = _shift;
        });

        return new ServiceResponse(true, '', { user_schedule, business, shift_date: _shift_date, shift, review_list });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getDetailUserSchedule' });
        return new ServiceResponse(false, '', {});
    }
};

const getShiftsOfUser = async (bodyParams = {}) => {
    const currentUsername = bodyParams.auth_name;
    const shiftDate = moment().format('YYYY-MM-DD');
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('USERNAME', currentUsername)
            .input('SHIFTDATE', shiftDate)
            .execute('HR_USER_SCHEDULE_GetCurrentShift_AdminWeb');

        let userShifts = data.recordsets[0];

        if (userShifts?.length > 0) {
            const data = userScheduleClass.currentShift(userShifts);
            return new ServiceResponse(true, 'success', data);
        } else {
            return new ServiceResponse(false, 'Bạn không có ca ngày hôm nay !');
        }
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getCurrentUserSchedule' });
        return new ServiceResponse(false, '', {});
    }
};

const getCurrentUserSchedule = async (bodyParams = {}) => {
    const currentUsername = bodyParams.auth_name;
    const shiftDate = moment().format('YYYY-MM-DD');
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', currentUsername)
            .input('SHIFTDATE', shiftDate)
            .execute('HR_USER_SCHEDULE_GetCurrentShift_AdminWeb');

        const currentUserSchedule = data.recordset[0];

        if (currentUserSchedule) {
            const shifts = currentUserSchedule?.SHIFTS && JSON.parse(currentUserSchedule?.SHIFTS);

            return new ServiceResponse(true, 'success', {
                ...userScheduleClass.currentShift(currentUserSchedule),
                shifts,
            });
        } else {
            return new ServiceResponse(false, 'Bạn không có ca ngày hôm nay !');
        }
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getCurrentUserSchedule' });
        return new ServiceResponse(false, '', {});
    }
};

const updateExplanation = async (bodyParams = {}) => {
    console.log(bodyParams);
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('SCHEDULEID', apiHelper.getValueFromObject(bodyParams, 'shift'))
            .input('EXPLANATION', apiHelper.getValueFromObject(bodyParams, 'excuses'))
            .execute('HR_USER_SCHEDULE_UpdateExplanation_AdminWeb');
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, {
            function: 'scheduleService.deleteSchedule',
        });
        return new ServiceResponse(false, e.message);
    }
};

const updateReview = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(body, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(`HR_USER_SCHEDULE_REVIEW_UpdateReview_AdminWeb`);

        return new ServiceResponse(true, 'Cập nhật mức duyệt thành công', {});
    } catch (e) {
        logger.error(e, { function: 'scheduleService.updateReview' });
        return new ServiceResponse(false, e.message);
    }
};

//Export phân ca ho tro
const exportScheduleSupport = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRes = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('ISOVERTIME', apiHelper.getValueFromObject(queryParams, 'is_overtime'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('CREATEDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            // .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .execute('HR_USER_SCHEDULE_ExportList_AdminWeb');
        const schedule = dataRes.recordset;

        const data = userScheduleClass.exportSchedule(schedule);

        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
            },
            row: {
                border: {
                    bottom: { style: 'dashed' },
                    left: { style: 'thin' },
                },
            },
            last_row: {
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                },
            },
            row_last_column: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
            border: {
                line: {
                    top_right: {
                        border: {
                            top: {
                                style: 'thin',
                            },
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    right: {
                        border: {
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    left_top_right: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    all: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                line_top_left: {
                    border: {
                        top: {
                            style: 'thick',
                            colo: 'black',
                        },
                        left: {
                            style: 'thick',
                            colo: 'black',
                        },
                    },
                },
            },
            body_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            },
        };
        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Danh sách Ca Hỗ TRợ');
        work_sheet.row(1).setHeight(40);
        work_sheet.column(1).freeze();
        work_sheet.column(3).setWidth(30);
        work_sheet.column(6).setWidth(40);

        const obj_short = [1, 2, 4, 5, 7, 8, 9, 10];

        obj_short.map((item, index) => work_sheet.column(item).setWidth(20));

        work_sheet.cell(1, 1, 1, 1, true).string('Mã ERP').style(styles.bold_center);
        work_sheet.cell(1, 2, 1, 2, true).string('Mã nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 3, 1, 3, true).string('Họ tên nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 4, 1, 4, true).string('Ngày làm').style(styles.bold_center);
        work_sheet.cell(1, 5, 1, 5, true).string('Ca làm').style(styles.bold_center);
        work_sheet.cell(1, 6, 1, 6, true).string('Giờ bắt đầu').style(styles.bold_center);
        work_sheet.cell(1, 7, 1, 7, true).string('Giờ kết thúc').style(styles.bold_center);
        work_sheet.cell(1, 8, 1, 8, true).string('Cửa hàng').style(styles.bold_center);
        work_sheet.cell(1, 9, 1, 9, true).string('Giờ vào').style(styles.bold_center);
        work_sheet.cell(1, 10, 1, 10, true).string('Giờ ra').style(styles.bold_center);

        let row_position = 2;
        for (let i = 0; i < data.length; i++) {
            work_sheet
                .cell(row_position, 1)
                .string(`${data[i]?.erp_code || ''}`)
                .style(styles.body_center);
            work_sheet
                .cell(row_position, 2)
                .string(`${data[i]?.user_name || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 3).string(`${data[i]?.user_fullname || ''}`);
            work_sheet
                .cell(row_position, 4)
                .string(`${data[i]?.time_keeping || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 5).string(`${data[i]?.shift_name || ''}`);
            work_sheet
                .cell(row_position, 6)
                .string(`${convertTimeHourMinutes(data[i]?.hour_start) || ''}`)
                .style(styles.body_center);
            work_sheet
                .cell(row_position, 7)
                .string(`${convertTimeHourMinutes(data[i]?.hour_end) || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 8).string(`${data[i]?.store_name || ''}`);
            work_sheet
                .cell(row_position, 9)
                .string(`${moment.utc(data[i]?.time_start).format('HH:mm') || ''}`)
                .style(styles.body_center);
            work_sheet
                .cell(row_position, 10)
                .string(`${(data[i]?.time_end && moment.utc(data[i]?.time_end).format('HH:mm')) || ''}`)
                .style(styles.body_center);

            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (error) {
        logger.error(error, { function: 'scheduleService.exportScheduleSupport' });
        return new ServiceResponse(false, error.message);
    }
};

const exportSchedule = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRes = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('ISOVERTIME', apiHelper.getValueFromObject(queryParams, 'is_overtime'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('CREATEDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            // .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .execute('HR_USER_SCHEDULE_Export_Shift_List_AdminWeb');
        const schedule = dataRes.recordset;

        const data = userScheduleClass.exportSchedule(schedule);

        let wb = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });
        let ws = null;
        ws = wb.addWorksheet('Danh Sách Phân Ca');
        ws.row(1).setHeight(40);
        ws.column(1).freeze();
        ws.column(4).setWidth(40);
        ws.column(8).setWidth(30);
        const obj_short = [1, 2, 3, 5, 6, 7];

        obj_short.map((item, index) => ws.column(item).setWidth(20));

        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            body_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            },
        };

        ws.cell(1, 1, 1, 1, true).string('Mã ERP').style(styles.bold_center);
        ws.cell(1, 2, 1, 2, true).string('Họ tên nhân viên').style(styles.bold_center);
        ws.cell(1, 3, 1, 3, true).string('Cửa hàng').style(styles.bold_center);
        ws.cell(1, 4, 1, 4, true).string('Ca làm').style(styles.bold_center);
        ws.cell(1, 5, 1, 5, true).string('Ngày làm').style(styles.bold_center);
        ws.cell(1, 6, 1, 6, true).string('Trạng thái').style(styles.bold_center);
        ws.cell(1, 7, 1, 7, true).string('Ngày tạo').style(styles.bold_center);
        ws.cell(1, 8, 1, 8, true).string('Người tạo').style(styles.bold_center);

        let row_position = 2;
        for (let i = 0; i < data.length; i++) {
            ws.cell(row_position, 1)
                .string(`${data[i]?.user_name || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 2).string(`${data[i]?.user_fullname || ''}`);
            ws.cell(row_position, 3)
                .string(`${data[i]?.store_name || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 4)
                .string(`${data[i]?.shift_name || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 5)
                .string(`${data[i]?.shift_date || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 6)
                .string(`${convertIsReview(data[i]?.is_review) || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 7)
                .string(`${data[i]?.date_create || ''}`)
                .style(styles.body_center);
            ws.cell(row_position, 8).string(`${data[i]?.created_user || ''}`);

            row_position += 1;
        }

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'scheduleService.exportSchedule' });
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getOptionCompany,
    getOptionBusiness,
    getOptionStore,
    createUserSchedule,
    getListUserSchedule,
    updateDetailUserSchedule,
    deleteUserSchedule,
    reviewUserSchedule,
    getUserReview,
    getOptionShiftByStoreId,
    getDetailUserSchedule,
    getCurrentUserSchedule,
    updateExplanation,
    getShiftsOfUser,
    updateReview,
    exportScheduleSupport,
    exportSchedule,
};
