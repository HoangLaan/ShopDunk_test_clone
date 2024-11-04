const timeKeepingClass = require('./time-keeping.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
let xl = require('excel4node');
const _ = require('lodash');
const path = require('path');
const appRootPath = require('app-root-path');
const fs = require('fs');
const { checkIsOffDay, getTimeFromDate } = require('./utils/helper');

const pathMediaUpload = path.normalize(`${appRootPath}/storage/export/excel-file`);

const getListUser = async (queryParams = {}, body = {}) => { 
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('ISACTIVE', 1)
            .input('FULLNAME', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('AUTHNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('HR_USER_TIMEKEEPING_getListUser_AdminWeb');
        let list_user = timeKeepingClass.listUser(data.recordsets[0]);
        let list_schedule = timeKeepingClass.listSchedule(data.recordsets[1]);
        const list_time_keeping = timeKeepingClass.timekeepingDetail(data.recordsets[2]);
        const is_lock_confirm = data.recordsets[3][0].ISLOCKCONFRIM;
        const list_holiday = timeKeepingClass.listHoliday(data.recordsets[4]);
        const list_off_work = timeKeepingClass.listOffWork(data.recordsets[5]);
        const list_work_schedule = timeKeepingClass.listWorkSchedule(data.recordsets[6]);
        list_schedule = list_schedule.map((item) => {
            let time_keeping = list_time_keeping.find(
                (item2) =>
                    item.user_name == item2.user_name &&
                    item.shift_date == item2.time_keeping &&
                    item.shift_id == item2.shift_id,
            );
            return time_keeping
                ? {
                    ...item,
                    ...time_keeping,
                }
                : {
                    ...item,
                };
        });

        let new_list_user = [];
        for (let i = 0; i < list_user.length; i++) {
            let item = list_user[i];
            item.is_selected = false;
            let listSchedule = list_schedule && list_schedule.filter((item2) => item.user_name == item2.user_name);
            let _listSchedule = {};
            let _listOffWork = (list_off_work || []).filter((x) => x.user_name == item.user_name);
            let _listWorkSchedule = (list_work_schedule || []).filter((x) => x.user_name == item.user_name);

            listSchedule.forEach((e) => {
                if (_listSchedule[e.shift_date]) {
                    _listSchedule[e.shift_date].push(e);
                } else {
                    _listSchedule[e.shift_date] = [e];
                }
            });

            new_list_user.push({
                ...item,
                listSchedule: _listSchedule,
                listOffWork: _listOffWork,
                listWorkSchedule: _listWorkSchedule,
            });
        }

        return new ServiceResponse(true, '', {
            data: new_list_user,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            is_lock_confirm: is_lock_confirm,
            list_holiday: list_holiday,
        });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListUser' });
        return new ServiceResponse(false, '', {});
    }
};

const getListTimeKeepingByUser = async (queryParams = {}, body = {}) => {
    try {
        const pool = await mssql.pool;
        const dataSchedule = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .execute('HR_USER_SCHEDULE_GetListByUserName_adminWeb');
        const Schedule = timeKeepingClass.listSchedule(dataSchedule.recordset);
        for (let index = 0; index < Schedule.length; index++) {
            const scheduleItem = Schedule[index];
            const reqSchedule = await pool
                .request()
                .input('USERNAME', apiHelper.getValueFromObject(scheduleItem, 'user_name'))
                .input('TIMEKEEPING', apiHelper.getValueFromObject(scheduleItem, 'shift_date'))
                .execute('HR_USER_SCHEDULE_GetTimeKeeping_adminWeb');
            const resSchedule = timeKeepingClass.timekeepingDetail(reqSchedule.recordset);
            Schedule[index] = { ...Schedule[index], ...resSchedule[0] };
        }

        return new ServiceResponse(true, '', {
            data: Schedule,
        });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListUser' });
        return new ServiceResponse(true, '', {});
    }
};

const checkPerMission = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('HR_USER_SCHEDULE_CheckPermission_adminWeb');
        const res = data.recordset;
        const resdepartment = timeKeepingClass.department(data.recordsets[1]);
        let datares = {};
        const checkCF = res.find((element) => element.FUNCTIONALIAS == 'HR_USER_TIMEKEEPING_CONFIRM');
        const checkall = res.find((element) => element.FUNCTIONALIAS == 'HR_USER_TIMEKEEPING_FULLACCESS');
        if (checkCF) {
            datares = { havePerrmission: 1, is_adm: 0 };
        } else {
            datares = { havePerrmission: 0, is_adm: 0 };
        }
        if (checkall) {
            datares = { havePerrmission: 1, department_id: 0, is_adm: 1, user_name: '' };
        }
        let finaldata = { ...datares, ...resdepartment[0] };
        if (apiHelper.getValueFromObject(body, 'auth_name') == 'administrator') {
            finaldata.havePerrmission = 1;
            finaldata.department_id = 0;
            finaldata.is_adm = 1;
            finaldata.user_name = '';
        }
        if (finaldata.is_adm == 1) {
            finaldata.department_id = 0;
        }
        return new ServiceResponse(true, '', { finaldata });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.checkPerMission' });
        return new ServiceResponse(true, '', {});
    }
};

const getListOption = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('HR_USER_SCHEDULE_GetOption_AdminWeb');
        const shifts = data.recordsets[0];
        const stores = data.recordsets[1];
        const departments = data.recordsets[2];
        const businesses = data.recordsets[3];

        let datares = [];
        datares.push(timeKeepingClass.listShift(shifts));
        datares.push(timeKeepingClass.listStore(stores));
        datares.push(timeKeepingClass.listDepartment(departments));
        datares.push(timeKeepingClass.listBusiness(businesses));

        return new ServiceResponse(true, '', { datares });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getListOption' });
        return new ServiceResponse(true, '', {});
    }
};
const createOrUpdateSchedule = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SCHEDULEID', apiHelper.getValueFromObject(bodyParams, 'schedule_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .input('SHIFTDATE', apiHelper.getValueFromObject(bodyParams, 'shift_date'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_USER_SCHEDULE_createOrUpdate_adminWeb');
        const schedule_id = data.recordset[0].RESULT;
        if (schedule_id <= 0) {
            return new ServiceResponse(false, 'create timekeeping fail');
        }

        return new ServiceResponse(true, 'success', schedule_id);
    } catch (e) {
        logger.error(e, { function: 'scheduleService.createOrUpdateSchedule' });
        return new ServiceResponse(false, 'create Schedule fail');
    }
};
const createOrUpdateTimeKeeping = async (bodyParams = {}) => {
    try {
        let message = '';
        let totalTimeLate = 0;
        const user_fullname = apiHelper.getValueFromObject(bodyParams, 'user_fullname')
        const pool = await mssql.pool;
        const totalTimesLate = await pool
            .request()
            .input(
                'SHIFTDATE',
                moment(apiHelper.getValueFromObject(bodyParams, 'shift_date'), 'DD-MM-YYYY').format(
                    'YYYY/MM/DD',
                ),
            )
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .execute('HR_USER_TIMEKEEPING_CountTimesLateConfirm_AdminWeb');
        const _totalTimeLate = totalTimesLate.recordset[0].TOTALTIMES;
        if (_totalTimeLate >= 2) {
            totalTimeLate = _totalTimeLate
            message = `${user_fullname} có nhiều hơn 2 lần đi trễ trong tháng này`
        }

        const data = await pool
            .request()
            .input('TIMEKEEPINGID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_id'))
            .input(
                'TIMEKEEPING',
                moment(apiHelper.getValueFromObject(bodyParams, 'shift_date'), 'DD-MM-YYYY').format('YYYY/MM/DD'),
            )
            .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .input('TIMESTART', apiHelper.getValueFromObject(bodyParams, 'time_start'))
            .input('TIMEEND', apiHelper.getValueFromObject(bodyParams, 'time_end'))
            .input('ISOVERTIME', apiHelper.getValueFromObject(bodyParams, 'is_over_time'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_USER_TIMEKEEPING_CreateOrUpdate_adminWeb');
        const timekeeping_id = data.recordset[0].RESULT;
        if (timekeeping_id <= 0) {
            return new ServiceResponse(false, 'create timekeeping fail');
        }

        return new ServiceResponse(true, 'success', { total_time_late: totalTimeLate, message: message, timekeeping_id: timekeeping_id });
    } catch (e) {
        logger.error(e, { function: 'time-keeping.service.createOrUpdateTimeKeeping' });
        return new ServiceResponse(false, 'create timekeeping fail');
    }
};

const deleteSchedule = async (schedule_id, body) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('SCHEDULEID', schedule_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('HR_USER_TIMEKEEPING_Delete_AdminWeb');
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, {
            function: 'scheduleService.deleteSchedule',
        });
        return new ServiceResponse(false, e.message);
    }
};
const createOrUpdateTimeKeepingList = async (bodyParams = []) => {
    try {
        let message = '';
        let totalTimeLate = 0;
        for (const [key, value] of Object.entries(bodyParams.user_confirm)) {
            if (value.listSchedule) {
                for (const [key_schedule, value_schedule] of Object.entries(value.listSchedule)) {
                    for (let i = 0; i < value_schedule.length; i++) {
                        const element = value_schedule[i];
                        if (
                            apiHelper.getValueFromObject(element, 'shift_date') &&
                            moment(apiHelper.getValueFromObject(element, 'shift_date'), 'DD-MM-YYYY').format(
                                'YYYY/MM/DD',
                            ) <= moment().format('YYYY/MM/DD')
                        ) {
                            const pool = await mssql.pool;
                            const totalTimesLate = await pool
                                .request()
                                .input(
                                    'SHIFTDATE',
                                    moment(apiHelper.getValueFromObject(element, 'shift_date'), 'DD-MM-YYYY').format(
                                        'YYYY/MM/DD',
                                    ),
                                )
                                .input('USERNAME', apiHelper.getValueFromObject(element, 'user_name'))
                                .execute('HR_USER_TIMEKEEPING_CountTimesLateConfirm_AdminWeb');
                            const _totalTimeLate = totalTimesLate.recordset[0].TOTALTIMES;
                            if (_totalTimeLate >= 2) {
                                totalTimeLate = _totalTimeLate
                                message = `${value?.user_fullname} có nhiều hơn 2 lần đi trễ trong tháng này`
                            }
                            const data = await pool
                                .request()
                                .input('TIMEKEEPINGID', apiHelper.getValueFromObject(element, 'time_keeping_id'))
                                .input(
                                    'TIMEKEEPING',
                                    moment(apiHelper.getValueFromObject(element, 'shift_date'), 'DD-MM-YYYY').format(
                                        'YYYY/MM/DD',
                                    ),
                                )
                                .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
                                .input('USERNAME', apiHelper.getValueFromObject(element, 'user_name'))
                                .input('TIMESTART', apiHelper.getValueFromObject(bodyParams, 'time_start'))
                                .input('TIMEEND', apiHelper.getValueFromObject(bodyParams, 'time_end'))
                                .input('ISOVERTIME', apiHelper.getValueFromObject(element, 'is_over_time'))
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .execute('HR_USER_TIMEKEEPING_CreateOrUpdate_adminWeb');
                            const timekeeping_id = data.recordset[0].RESULT;

                            if (timekeeping_id <= 0) {
                                return new ServiceResponse(false, 'fail create update timekeeping');
                            }
                        }
                    }
                }
            }
        }
        return new ServiceResponse(true, 'success', { total_time_late: totalTimeLate, message: message });
    } catch (e) {
        logger.error(e, { function: 'time-keeping.service.createOrUpdateTimeKeeping' });
        return new ServiceResponse(false, 'create timekeeping fail');
    }
};

const getDataExport = async (query = {}) => {
    try {
        const pool = await mssql.pool;

        // get user list
        let users = apiHelper.getValueFromObject(query, 'users');

        users = users.join('|');

        const data = await pool
            .request()
            .input('USERNAME', users)
            .input('FROMDATE', apiHelper.getValueFromObject(query, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(query, 'to_date'))
            .execute('HR_USER_TIMEKEEPING_Export_AdminWeb');
        let timekeeping = timeKeepingClass.timeKeepingExcel(data.recordset);

        const d = moment().format('YYYY/MM/DD');
        const weekdate = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
        // Tính lại số công, tổng phút làm, số lần đi trễ về sớm
        timekeeping = (timekeeping || []).map((x) => {
            let minute_late = 0,
                minute_early = 0,
                working_day = 0,
                minute_working_date = 0,
                note = '';
            if (x.checkin_time_confirm && x.checkout_time_confirm) {
                const {
                    shift_minute_checkin_late = 0,
                    shift_minute_checkout_early = 0,
                    shift_hour_checkin,
                    shift_minute_checkin,
                    shift_hour_checkout,
                    shift_minute_checkout,
                    shift_hour_break_start,
                    shift_minute_break_start,
                    shift_hour_break_end,
                    shift_minute_break_end,
                    checkin_time_confirm,
                    checkout_time_confirm,
                    shift_number_of_work_day = 0,
                    shift_shift_time,
                    checkin_late,
                    checkout_early,
                    checkin_time,
                    checkout_time,
                    stime_start,
                    stime_end
                } = x;
                // Tạo ngày tháng checkin và checkout (YYYY/MM/DD HH:mm:ss)
                const checkin_date = moment(`${d} ${checkin_time_confirm ?? checkin_time}`, 'YYYY/MM/DD HH:mm:ss'); // Lấy theo thời gian confirm
                const checkout_date = moment(`${d} ${checkout_time_confirm ?? checkout_time}`, 'YYYY/MM/DD HH:mm:ss');
                let minute_break_of_date = 0,
                    minute_work_day = 0,
                    minute_checkin_late = 0,
                    minute_checkout_early = 0;
                // Nếu có giờ nghỉ thì tính số phút nghỉ
                if (
                    (shift_hour_break_start > 0 || shift_minute_break_start > 0) &&
                    (shift_hour_break_end > 0 || shift_minute_break_end > 0)
                ) {
                    // Tạo giờ nghỉ bắt đầu và kết thúc (theo ngày) (YYYY/MM/DD HH:mm:ss)
                    const break_start_date = moment(
                        `${d} ${shift_hour_break_start}:${shift_minute_break_start}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );
                    const break_end_date = moment(
                        `${d} ${shift_hour_break_end}:${shift_minute_break_end}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );
                    // Tính tổng số phút nghỉ
                    minute_break_of_date = break_end_date.diff(break_start_date, 'minutes');
                    //check xem có check out trước giờ nghỉ hay không
                    let minute_checkin_to_break = break_start_date.diff(checkin_date, 'minutes');
                    let minute_checkin_to_checkout = checkout_date.diff(checkin_date, 'minutes');
                    // nếu check out trước giờ nghỉ trưa thì giờ làm không trừ giờ nghỉ
                    if (minute_checkin_to_break > minute_checkin_to_checkout) {
                        minute_break_of_date = 0;
                    }
                    // check xem có check in trong hoặc sau giờ nghỉ trưa hay không
                    let check_break_to_checkin = break_start_date.diff(checkin_date, 'minutes');
                    // nếu có thì giờ làm không trừ giờ nghỉ trưa
                    if (check_break_to_checkin <= 0) {
                        minute_break_of_date = 0;
                    }
                }

                // Tính tổng số phút làm việc trừ số phút nghỉ
                minute_work_day = checkout_date.diff(checkin_date, 'minutes') - minute_break_of_date;
                minute_work_day = minute_work_day < 0 ? 0 : minute_work_day;
                minute_working_date += minute_work_day || 0;

                // Tính công làm việc , lấy tổng thời gian thực tế * số công ca / thời gian của ca làm việc
                let number_of_work_day = (minute_work_day * shift_number_of_work_day) / (shift_shift_time || 1);
                working_day =
                    number_of_work_day > shift_number_of_work_day
                        ? shift_number_of_work_day
                        : Number(number_of_work_day).toFixed(2);
                // Tính số phút đi trễ và vế sớm
                const checkin_late_date = moment(
                    `${d} ${stime_start}`,  // lấy thời gian vào ca theo quy định
                    'YYYY/MM/DD HH:mm:ss',
                );
                const checkout_early_date = moment(
                    `${d} ${stime_end}`,
                    'YYYY/MM/DD HH:mm:ss',
                );

                // Số phút checkin trễ + số phút được phép trễ
                minute_checkin_late = checkin_late_date.diff(checkin_date, 'minutes') + shift_minute_checkin_late * 1;

                // Số phút checkout sớm + số phút được về sớm
                minute_checkout_early =
                    checkout_date.diff(checkout_early_date, 'minutes') + shift_minute_checkout_early * 1;
                // Làm tròn số
                if (minute_checkin_late > 0) minute_checkin_late = 0    // minute_checkin_late > 0 => đi sớm hoặc đúng giờ
                if (minute_checkout_early > 0) minute_checkout_early = 0
                // Nếu số phút < 0 thì trễ hoặc sớm
                if (minute_checkin_late < 0) minute_late = Math.abs(minute_checkin_late);
                if (minute_checkout_early < 0) minute_early = Math.abs(minute_checkout_early);
                // nếu nếu time check in là time của ca tăng ca thì note là TC

                minute_working_date = minute_working_date * 1;
                minute_late = minute_checkin_late ?? (checkin_late * 1 || 0);
                minute_early = minute_checkout_early ?? (checkout_early * 1 || 0);
                working_day = working_day * 1;
            }

            if (x.shift_is_over_time) {
                if (x.is_holiday) {
                    note = 'TC lễ';
                } else {
                    note = 'TC';
                }
            } else if (x.is_holiday) {
                note = 'Lễ';
            } else if (x.is_offwork) {
                note = 'P';
            } else {
                note = '';
            }

            return {
                ...x,
                working_day,
                minute_late,
                minute_early,
                minute_working_date,
                note: note,
                day_off_week: weekdate[moment(x.date_in_month, 'DD/MM/YYYY').weekday()],
            };
        });
        let summary = {};
        if (query && query.users && query.users.length == 1) {
            let number_of_work_day = 0,
                hour_of_work_day = 0,
                time_checkin_late = 0,
                minute_checkin_late = 0,
                time_checkout_early = 0,
                minute_checkout_early = 0;
            for (let i = 0; i < timekeeping.length; i++) {
                const { working_day = 0 } = timekeeping[i];
                number_of_work_day += working_day;
                hour_of_work_day += (timekeeping[i].minute_working_date || 0) * 1;
                if (timekeeping[i].minute_late) {
                    time_checkin_late++;
                    minute_checkin_late += (timekeeping[i].minute_late || 0) * 1;
                }
                if (timekeeping[i].minute_early) {
                    time_checkout_early++;
                    minute_checkout_early += (timekeeping[i].minute_early || 0) * 1;
                }
            }
            hour_of_work_day = Number((hour_of_work_day || 0) / 60).toFixed(2) * 1;
            summary = {
                number_of_work_day,
                hour_of_work_day,
                time_checkin_late,
                minute_checkin_late,
                time_checkout_early,
                minute_checkout_early,
            };
        }
        return new ServiceResponse(true, 'ok', { timekeeping, summary });
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getDataExport' });
        return new ServiceResponse(true, '', {
            timekeeping: [],
            summary: {},
        });
    }
};

const exportExcel = async (bodyParams = {}) => {
    try {
        const query = apiHelper.getValueFromObject(bodyParams, 'query');
        const users = apiHelper.getValueFromObject(bodyParams, 'users');

        //Kiểm tra xem có phải là export toàn bộ user không
        // ==> nếu là export toàn bột nhân viên
        // ==> tạo 1 file csv lưu thông tin của giữ liệu nhân viên đã xuất

        // Kiem tra xem export mot nhan vien hay nhieu nhan vien
        const userTimeKeeping = users.length ? users[0] : {};
        const isMultipleUser = users.length > 1 ? true : false;

        // Lấy dữ liệu export
        const dataRes = await getDataExport({
            from_date: query.date_from,
            to_date: query.date_to,
            users: (users || []).map((x) => x.user_name),
        });

        if (dataRes.isFailed()) return new ServiceResponse(false, dataRes.getErrors());
        let dataTimeKeeping = dataRes.getData();
        let wb = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        // Khai bao style cho excel
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
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
        };

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Chi tiết');

        const column = isMultipleUser ? 13 : 10;
        const rowHeader = isMultipleUser ? 4 : 6;

        const header_add_on = isMultipleUser
            ? {
                user_name: 'Mã nhân viên',
                full_name: 'Họ tên',
                department_name: 'Phòng ban',
            }
            : {};
        // Khai báo header
        const header = {
            date_in_month: 'Ngày',
            ...header_add_on,
            day_off_week: 'Thứ',
            checkin_time: 'Giờ vào',
            checkout_time: 'Giờ ra',
            checkin_time_confirm: 'Giờ vào xác nhận',
            checkout_time_confirm: 'Giờ ra xác nhận',
            minute_late: 'Số phút đi trễ',
            minute_early: 'Số phút về sớm',
            working_day: 'Công',
            note: 'Ghi chú',
            business_name: 'Chi nhánh',
        };

        // Data timekeeping
        let data = dataTimeKeeping.timekeeping || [];

        ws.cell(1, 1, 1, column, true)
            .string(
                `${isMultipleUser ? 'DANH SÁCH' : 'BẢNG CHI TIẾT'} CHẤM CÔNG THÁNG ${query.date_from
                    ? moment(query.date_from, 'DD/MM/YYYY').format('MM/YYYY')
                    : moment().format('MM/YYYY')
                }`,
            )
            .style({
                ...styles.bold_center,
                border: {
                    right: { style: isMultipleUser ? 'none' : 'thin' },
                },
            });
        if (!isMultipleUser) {
            ws.cell(2, 1, 2, column, true)
                .string(
                    `Mã nhân viên: ${userTimeKeeping.user_name}   Tên nhân viên: ${userTimeKeeping.user_fullname}   Phòng ban: ${userTimeKeeping.department_name}`,
                )
                .style({
                    fill: {
                        type: 'pattern', // the only one implemented so far.
                        patternType: 'solid', // most common.
                        fgColor: 'yellow',
                    },
                    ...styles.bold_center,
                    ...styles.border.line.right,
                    border: { top: { style: 'thin' }, right: { style: 'thin' } },
                });
            ws.cell(3, 1, 4, 2, true)
                .string('TỔNG')
                .style({ ...styles.bold_center });
            ws.cell(3, 3, 3, 3)
                .string('Số công')
                .style({ ...styles.bold_center });
            ws.cell(3, 4, 3, 4)
                .string('Số giờ')
                .style({ ...styles.bold_center });
            ws.cell(3, 5, 4, 5, true)
                .string('Đi trễ')
                .style({ ...styles.bold_center });
            ws.cell(3, 6, 3, 6)
                .string('Số lần')
                .style({ ...styles.bold_center });
            ws.cell(3, 7, 3, 7)
                .string('Số phút')
                .style({ ...styles.bold_center });
            ws.cell(3, 8, 4, 8, true)
                .string('Về sớm')
                .style({ ...styles.bold_center });
            ws.cell(3, 9, 3, 9)
                .string('Số lần')
                .style({ ...styles.bold_center });
            ws.cell(3, column, 3, column)
                .string('Số phút')
                .style({ ...styles.bold_center, border: styles.border.line.left_top_right });

            ws.cell(4, 3, 4, 3)
                .number(dataTimeKeeping.summary.number_of_work_day || 0)
                .style({ ...styles.bold_center });
            ws.cell(4, 4, 4, 4)
                .number(dataTimeKeeping.summary.hour_of_work_day || 0)
                .style({ ...styles.bold_center });

            ws.cell(4, 6, 4, 6)
                .number(dataTimeKeeping.summary.time_checkin_late || 0)
                .style({ ...styles.bold_center });
            ws.cell(4, 7, 4, 7)
                .number(dataTimeKeeping.summary.minute_checkin_late || 0)
                .style({ ...styles.bold_center });

            ws.cell(4, 9, 4, 9)
                .number(dataTimeKeeping.summary.time_checkout_early || 0)
                .style({ ...styles.bold_center });
            ws.cell(4, column, 4, column)
                .number(dataTimeKeeping.summary.minute_checkout_early || 0)
                .style({ ...styles.bold_center, border: styles.border.line.left_top_right });
        }
        // Space
        if (!isMultipleUser) ws.cell(5, 1, 5, column, true).style(styles.border.line.top_right);

        // Set height and height
        ws.row(isMultipleUser ? 4 : 6).setHeight(35);
        ws.column(column).setWidth(25);
        ws.column(column + 1).setWidth(25);
        if (isMultipleUser) {
            ws.column(3).setWidth(25);
            ws.column(4).setWidth(25);
            ws.column(column + 1).setWidth(25);
        }

        // Render data
        data.unshift(header);
        const maxRow = rowHeader + data.length - 1;
        data.forEach((item, index) => {
            let indexRow = index + rowHeader;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol)
                .string((item.date_in_month || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            if (isMultipleUser) {
                //add on
                ws.cell(indexRow, ++indexCol)
                    .string((item.user_name || '').toString())
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .string((item.full_name || '').toString())
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .string((item.department_name || '').toString())
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
            }
            ws.cell(indexRow, ++indexCol)
                .string((item.day_off_week || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.checkin_time || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.checkout_time || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.checkin_time_confirm || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.checkout_time_confirm || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            if (indexRow == rowHeader) {
                ws.cell(indexRow, ++indexCol)
                    .string(item.minute_late || '')
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .string(item.minute_early || '')
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .string(item.working_day || '')
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
            } else {
                ws.cell(indexRow, ++indexCol)
                    .number(item.minute_late || 0)
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .number(item.minute_early || 0)
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
                ws.cell(indexRow, ++indexCol)
                    .number(item.working_day || 0)
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
            }
            ws.cell(indexRow, ++indexCol)
                .string((item.note || '').toString())
                .style(
                    indexRow == rowHeader
                        ? { ...styles.header }
                        : indexRow < maxRow
                            ? { ...styles.row, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } }
                            : {
                                ...styles.last_row,
                                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                            },
                );
            ws.cell(indexRow, ++indexCol)
                .string((item.business_name || '').toString())
                .style(
                    indexRow == rowHeader
                        ? { ...styles.header, border: styles.border.line.all }
                        : indexRow < maxRow
                            ? {
                                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                                border: {
                                    bottom: { style: 'dashed' },
                                    left: { style: 'thin' },
                                    right: { style: 'thin' },
                                },
                            }
                            : {
                                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                                border: {
                                    bottom: { style: 'thin' },
                                    left: { style: 'thin' },
                                    right: { style: 'thin' },
                                },
                            },
                );
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        return new ServiceResponse(false, error.message || error);
    }
};



function countUniqueSupportDates(arr) {
    // Lọc các phần tử có ISSUPPORT === 1 và ít nhất một trong các trường không null
    const supportElements = arr.filter(item =>
        item.ISSUPPORT === 1 &&
        (
            item.CHECKINTIME !== null ||
            item.CHECKOUTTIME !== null ||
            item.CHECKINTIMECONFIRM !== null ||
            item.CHECKOUTTIMECONFIRM !== null ||
            item.CONFIRMHOURSTART !== null ||
            item.CONFIRMMINUTESTART !== null ||
            item.CONFIRMHOUREND !== null ||
            item.CONFIRMMINUTEEND !== null
        )
    );

    // Tạo một object để đếm số lần xuất hiện của mỗi DATEINMONTH
    const dateCounts = arr.reduce((acc, item) => {
        const date = item.DATEINMONTH;
        if (date) {
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {});

    // Lọc các phần tử có DATEINMONTH chỉ xuất hiện một lần
    const uniqueDates = Object.keys(dateCounts).filter(date => dateCounts[date] === 1);

    // Đếm số phần tử có DATEINMONTH duy nhất và có ISSUPPORT === 1
    const uniqueSupportElementsCount = supportElements.filter(item => uniqueDates.includes(item.DATEINMONTH)).length;

    return uniqueSupportElementsCount;
}

const getDataExportMultipleUser = async (query = {}) => {
    try {
        const pool = await mssql.pool;
        // get user list
        let users = apiHelper.getValueFromObject(query, 'users');
        users = users.join('|');
        const data = await pool
            .request()
            .input('USERNAME', users)
            .input('FROMDATE', apiHelper.getValueFromObject(query, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(query, 'to_date'))
            .execute('HR_USER_TIMEKEEPING_ExportMultipleUser_V2_AdminWeb');
        let timekeeping = timeKeepingClass.timeKeepingExcel(data.recordset);
    
        let countIssportInday
        if (data.recordset.length > 0) {
            countIssportInday = countUniqueSupportDates(data.recordset)
        }

        if (apiHelper.getValueFromObject(query, 'type') === 1) { // Dạng danh sách
            let days = _.orderBy(Object.keys(_.groupBy(timekeeping, 'date_in_month')), (x) => x, ['asc']);
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            for (const key in user) {
                let item = {
                    user_name: key,
                    full_name: _.find(user[key], (x) => x.user_name === key)?.full_name,
                    business_name: _.find(user[key], (x) => x.user_name === key)?.business_name,
                    working: [],
                    working_day: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.is_working_day ? x.shift_number_of_work_day : 0)),
                        0,
                    ),
                };
                for (const day of days) {
                    item.working.push({
                        date_in_month: day,
                        checkin_time: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkin_time,
                        checkout_time: _.findLast(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkout_time,
                        checkin_time_confirm: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkin_time_confirm,
                        checkout_time_confirm: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkout_time_confirm,
                    });
                }
                list_user.push(item);
            }
            return new ServiceResponse(true, '', { days: days, list_user: list_user });
        } else if (apiHelper.getValueFromObject(query, 'type') === 2) { // Dạng danh bảng
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            const d = moment().format('YYYY/MM/DD');
            for (const property in user) {
                let item = {
                    total_working: 0, // tổng tất cả các công làm
                    total_working_online: 0, // tổng công online
                    total_working_holiday: 0, // tổng công ngày nghỉ
                    total_not_working_holiday: 0, // tổng công không làm ngày nghỉ
                    total_not_time_keeping: 0, // tổng quên chấm công
                    total_check_in_late_to_30: 0, // tổng số lần đi muộn dưới 30 phú
                    total_check_in_late_from_30_to_60: 0, // tổng số lần đi muộn từ 30 p đến 60p
                    total_check_in_late_from_60: 0, // tổng số lần đi mượn hơn 60p
                    business_name: null,
                    full_name: null,
                    position_name: null,
                    working_day: 0, // số ngày đi làm,
                    note: '',
                };
                const d = moment().format('YYYY/MM/DD');
                for (let index = 0; index < user[property].length; index++) {
                    const element = user[property][index];
                    if (element.is_working_day) {
                        if (element.is_holiday) {
                            if (element.time_keeping) {
                                item.total_working_holiday += 1; // Tổng công làm ngày lễ
                            } else item.total_not_working_holiday += 1; //Tổng công không làm ngày lễ
                        }
                        if (element.is_online) item.total_working_online += 1; //Tổng công online
                    }
                    if (element.schedule_id && !element.timekeeping_date && !element.is_holiday && !element.is_offwork) item.total_not_time_keeping += 1; // Tổng số lần quên chấm công

                    item.business_name = element.business_name;
                    item.full_name = element.full_name;
                    item.position_name = element.position_name;
                    // Tạo ngày tháng checkin và checkout (YYYY/MM/DD HH:mm:ss)
                    const checkin_date = moment(`${d} ${element.checkin_time_confirm ?? element.checkin_time}`, 'YYYY/MM/DD HH:mm:ss');
                    const checkout_date = moment(`${d} ${element.checkout_time_confirm ?? element.checkout_time}`, 'YYYY/MM/DD HH:mm:ss');

                    let minute_break_of_date = 0,
                        minute_work_day = 0,
                        minute_checkin_late = 0,
                        minute_checkout_early = 0,
                        minute_working_date = 0,
                        working_day,
                        minute_late = 0,
                        minute_early = 0,
                        checkin_late = 0,
                        checkout_early,
                        note = '';
                    // Nếu có giờ nghỉ thì tính số phút nghỉ
                    if (
                        (element.shift_hour_break_start > 0 || element.shift_minute_break_start > 0) &&
                        (element.shift_hour_break_end > 0 || element.shift_minute_break_end > 0)
                    ) {
                        // Tạo giờ nghỉ bắt đầu và kết thúc (theo ngày) (YYYY/MM/DD HH:mm:ss)
                        const break_start_date = moment(
                            `${d} ${element.shift_hour_break_start}:${element.shift_minute_break_start}:00`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const break_end_date = moment(
                            `${d} ${element.shift_hour_break_end}:${element.shift_minute_break_end}:00`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        // Tính tổng số phút nghỉ
                        minute_break_of_date = break_end_date.diff(break_start_date, 'minutes');
                        //check xem có check out trước giờ nghỉ hay không
                        let minute_checkin_to_break = break_start_date.diff(checkin_date, 'minutes');
                        let minute_checkin_to_checkout = checkout_date.diff(checkin_date, 'minutes');
                        // nếu check out trước giờ nghỉ trưa thì giờ làm không trừ giờ nghỉ
                        if (minute_checkin_to_break > minute_checkin_to_checkout) {
                            minute_break_of_date = 0;
                        }
                        // check xem có check in trong hoặc sau giờ nghỉ trưa hay không
                        let check_break_to_checkin = break_start_date.diff(checkin_date, 'minutes');
                        // nếu có thì giờ làm không trừ giờ nghỉ trưa
                        if (check_break_to_checkin <= 0) {
                            minute_break_of_date = 0;
                        }
                    }

                    // Tính tổng số phút làm việc trừ số phút nghỉ
                    minute_work_day = checkout_date.diff(checkin_date, 'minutes') - minute_break_of_date;
                    minute_work_day = minute_work_day < 0 ? 0 : minute_work_day;
                    minute_working_date += minute_work_day || 0;
                    // Tính công làm việc , lấy tổng thời gian thực tế * số công ca / thời gian của ca làm việc
                    let number_of_work_day = (minute_work_day * element.shift_number_of_work_day) / (element.shift_shift_time || 1);
                    working_day =
                        number_of_work_day > element.shift_number_of_work_day
                            ? element.shift_number_of_work_day
                            : Number(number_of_work_day).toFixed(2);
                    // Tính số phút đi trễ và vế sớm
                    const checkin_late_date = moment(
                        `${d} ${element.shift_hour_checkin}:${element.shift_minute_checkin}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );
                    const checkout_early_date = moment(
                        `${d} ${element.shift_hour_checkout}:${element.shift_minute_checkout}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );

                    // Số phút checkin trễ + số phút được phép trễ
                    minute_checkin_late =
                        checkin_late_date.diff(checkin_date, 'minutes') + element.shift_minute_checkin_late * 1;

                    // Số phút checkout sớm + số phút được về sớm
                    minute_checkout_early =
                        checkout_date.diff(checkout_early_date, 'minutes') + element.shift_minute_checkout_early * 1;

                    // Nếu số phút < 0 thì trễ hoặc sớm
                    if (minute_checkin_late < 0) minute_late = Math.abs(minute_checkin_late);
                    if (minute_checkout_early < 0) minute_early = Math.abs(minute_checkout_early);
                    // nếu nếu time check in là time của ca tăng ca thì note là TC
                    if (minute_checkin_late < 30 || minute_checkout_early < 30) item.total_check_in_late_to_30 += 1; // Tổng số lần đi làm trễ dưới 30 phút
                    if (minute_checkin_late >= 30 && minute_checkin_late <= 60)
                        item.total_check_in_late_from_30_to_60 += 1; //Tổng số lần đi làm trễ từ 30 đến 60 phút
                    if (minute_checkin_late > 60) item.total_check_in_late_from_60 += 1; //Tổng số lần đi trên trên 60 phút
                    minute_working_date = minute_working_date * 1;
                    minute_late = checkin_late * 1 || 0;
                    minute_early = checkout_early * 1 || 0;
                    working_day = working_day * 1;
                    item.working_day += working_day;
                    if (element.shift_is_over_time) {
                        if (element.is_holiday) {
                            note = 'TC lễ';
                        } else {
                            note = 'TC';
                        }
                    } else if (element.is_holiday) {
                        note = 'Lễ';
                    } else if (element.is_offwork) {
                        note = 'P';
                    } else {
                        note = '';
                    }
                    item.note = note;
                }
                list_user.push({ ...item, schedule: user[property] });
            }
            return new ServiceResponse(true, 'ok', { list_user });
        } else if (apiHelper.getValueFromObject(query, 'type') === 3) { // Dạng danh mới bên shopdunk
            let days = _.orderBy(Object.keys(_.groupBy(timekeeping, 'date_in_month')), (x) => x, ['asc']);
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            let length_of_header = 0;
            let max_length_of_header = 0;
            let _days = [...days];
            let _max_days = [...days];
            _max_days = _max_days.map((date) => ({
                day: date,
                number_of_col: 0
            }));
            for (const key in user) {
                let item = {
                    total_time: _.find(user[key], (x) => x.user_name === key)?.total_time,
                    is_time_keeping: _.find(user[key], (x) => x.user_name === key)?.is_time_keeping,
                    user_name: key,
                    full_name: _.find(user[key], (x) => x.user_name === key)?.full_name,
                    business_name: _.find(user[key], (x) => x.user_name === key)?.business_name,
                    working: [],
                    position_name: _.find(user[key], (x) => x.user_name === key)?.position_name,
                    entry_date: _.find(user[key], (x) => x.user_name === key)?.entry_date,
                    shift_number_of_work_day: _.find(user[key], (x) => x.user_name === key)?.shift_number_of_work_day,
                    working_day: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.is_working_day ? x.shift_number_of_work_day : 0)),
                        0,
                    ),
                    standard_points_values: _.find(user[key], (x) => x.user_name === key)?.standard_points_values, // công tiêu chuẩn
                    time_can_off: _.find(user[key], (x) => x.user_name === key)?.time_can_off,
                    total_time_off: _.find(user[key], (x) => x.user_name === key)?.total_time_off,
                    department_name: _.find(user[key], (x) => x.user_name === key)?.department_name,
                    block_name: _.find(user[key], (x) => x.user_name === key)?.block_name,
                    actual_working_point_total: 0, // công làm thực tế
                    online_working_point_total: 0, // công online
                    support_point_total: 0, //công hỗ trợ
                    training_point_total: 0, // công đào tạo
                    market_research_point_total: 0, // công thị trường
                    off_work_total: 0, //nghỉ phép
                    holiday_total: 0, // nghỉ lễ
                    diff_off_work_total: 0, // nghỉ khác
                    pay_working_point_total: 0, // tổng công hưởng lương
                    allowance_point_total: 0, // tổng công hưởng phụ cấp (tổng công hưởng lương - nghỉ phép - nghỉ lễ - nghỉ khác)
                    standard_work: 0, // công tiêu chuẩn
                    pay_working_point_month: 0, // tổng công hưởng lương tháng này  =  tổng công hưởng lương
                    plus_working_point_month: 0, // Tổng công hưởng thêm tháng này = (tổng công hưởng lương - công tiêu chuẩn)
                    total_check_in_late_to_30: 0, // tổng số lần đi muộn dưới 30 phú
                    total_check_in_late_from_30_to_60: 0, // tổng số lần đi muộn từ 30 p đến 60p
                    total_check_in_late_from_60: 0, // tổng số lần đi muộn hơn 60p
                    total_check_out_early_to_30: 0, // tổng số lần về sớm dưới 30 phú
                    total_check_out_early_from_30_to_60: 0, // tổng số lần về sớm từ 30 p đến 60p
                    total_check_out_early_from_60: 0, // tổng số lần về sớm hơn 60p
                    total_time_mistake_30: 0, // cộng lần phạm lỗi trong mốc dưới 30 p (ca QC thì không cần quan tâm )
                    total_time_mistake_30_60: 0, // cộng lần phạm lỗi trong mốc từ 30 p đến 60
                    total_time_mistake_60: 0, // cộng lần phạm lỗi trong mốc trên 60p
                    normal_time_ot_total: 0, // tổng thời gian ca OT ngày thường
                    offday_time_ot_total: 0, // tổng thời gian ca OT ngày nghỉ ( đi làm vào thứ 7, CN trong đó có số ngày là ngày chẵn)
                    holiday_time_ot_total: 0, // tổng thời gian ca OT ngày lễ
                    hour_working_over_total: 0, // tổng thời gian trong ca có thời gian làm vượt hơn 8 tiếng: ví dụ ca C1020 kéo dài 10 tiếng / Nhân sự làm 5 ca trong tháng / thời gian vượt ca là : (10-8)*5
                    hour_office_over_total: 0, // tống số giờ làm thêm đối với nhân sự là khối văn phòng
                    // off_work_total: 0,
                    off_work_use_in_month: 0, // phép sử dụng trong tháng  
                    // off_work_left: 0,
                    boundary_point_total: 0, // công định biên
                    store: _.find(user[key], (x) => x.user_name === key)?.store,
                    miss_time: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.miss_time)),
                        0,
                    ),
                };
                for (let j = 0; j < days.length; j++) {
                    // lặp qua ngày và xử lý logic đếm
                    const d = moment().format('YYYY/MM/DD');
                    _days[j] = { day: days[j], number_of_col: 0 };
                    const shifts =
                        timekeeping.filter((item) => item.date_in_month === days[j] && item.user_name === key) || [];
                    for (let i = 0; i < shifts.length; i++) {
                        const timekeepingInDay = _.filter(
                            timekeeping,
                            (o) => o.user_name === key && o.date_in_month === days[j],
                        )[i];
                        // lặp qua số ca trong ngày
                        _days[j].number_of_col += 2;
                        if (timekeepingInDay.is_break_shift == 1) {
                            // ca gãy thì cộng thêm 2 cột nữa
                            length_of_header += 2;
                            _days[j].number_of_col += 2;
                        }
                        length_of_header += 2;
                        item.working.push({
                            //push thông tin ngày ca làm việc theo ngày
                            date_in_month: days[j],
                            checkin_time: timekeepingInDay?.checkin_time,
                            checkout_time: timekeepingInDay?.checkout_time,
                            checkin_time_confirm: timekeepingInDay?.checkin_time_confirm,
                            checkout_time_confirm: timekeepingInDay?.checkout_time_confirm,
                            checkout_break_time: timekeepingInDay?.checkout_break_time,
                            checkin_break_time: timekeepingInDay?.checkin_break_time,
                            is_check_store: timekeepingInDay?.is_check_store,
                            is_break_shift: timekeepingInDay?.is_break_shift,
                            is_online: timekeepingInDay?.is_online,
                            is_support: timekeepingInDay?.is_support,
                            is_training: timekeepingInDay?.is_training,
                            is_market_research: timekeepingInDay?.is_market_research,
                            total_time_confirm: timekeepingInDay?.total_time_confirm,
                            shift_is_over_time: timekeepingInDay?.shift_is_over_time,
                            is_holiday: timekeepingInDay?.is_holiday,
                            is_offwork: timekeepingInDay?.is_offwork,
                            work_time: (timekeepingInDay?.work_time && !timekeepingInDay?.is_support ? timekeepingInDay?.work_time : 0),
                        });
                        //Xử lý logic: ( có 3 loại ca: ca thường, ca gãy, ca QC)
                        let shift_shift_time = -1;
                        if (
                            timekeepingInDay.is_online !== 1 &&
                            timekeepingInDay.is_support !== 1 &&
                            timekeepingInDay.is_training !== 1 &&
                            timekeepingInDay.is_market_research !== 1 &&
                            timekeepingInDay.off_work == undefined &&
                            timekeepingInDay.is_holiday !== 1
                        ) {
                            //handle 3 loại ca: ca thường, ca gãy, ca QC
                            shift_shift_time = timekeepingInDay.shift_shift_time || 0; // thời gian của ca làm việc
                        }
                        // Tạo ngày tháng checkin và checkout theo quy định của ca làm việc(YYYY/MM/DD HH:mm:ss)
                        const checkin_date = moment(
                            `${d} ${timekeepingInDay?.stime_start}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const checkout_date = moment(
                            `${d} ${timekeepingInDay?.stime_end}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        // tạo thời gian checkin // nếu không có checkin sẽ lấy thời gian confirm
                        const checkin_date_user = moment(`${d} ${timekeepingInDay.checkin_time_confirm ?? timekeepingInDay.checkin_time}`, 'YYYY/MM/DD HH:mm:ss'); // Lấy theo thời gian confirm
                        const checkout_date_user = moment(`${d} ${timekeepingInDay.checkout_time_confirm ?? timekeepingInDay.checkout_time}`, 'YYYY/MM/DD HH:mm:ss');
                        //checkin_time_confirm ?? checkin_time
                        // Tính số phút làm việc
                        const checkin_confirm_date = moment(
                            `${d} ${timekeepingInDay.checkin_time_confirm ?? timekeepingInDay.checkin_time}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const checkout_confirm_date = moment(
                            `${d} ${timekeepingInDay.checkout_time_confirm ?? timekeepingInDay.checkout_time}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        let minute_break_of_date = 0,
                            minute_work_day = 0,
                            minute_checkin_late = 0,
                            minute_checkout_early = 0;
                        // checkin_late = 0,
                        // checkout_early = 0;
                        // Nếu có giờ nghỉ thì tính số phút nghỉ
                        if (
                            (timekeepingInDay.shift_hour_break_start > 0 ||
                                timekeepingInDay.shift_minute_break_start > 0) &&
                            (timekeepingInDay.shift_hour_break_end > 0 || timekeepingInDay.shift_minute_break_end > 0)
                        ) {
                            // Tạo giờ nghỉ bắt đầu và kết thúc (theo ngày) (YYYY/MM/DD HH:mm:ss)
                            const break_start_date = moment(
                                `${d} ${timekeepingInDay.shift_hour_break_start}:${timekeepingInDay.shift_minute_break_start}:00`,
                                'YYYY/MM/DD HH:mm:ss',
                            );
                            const break_end_date = moment(
                                `${d} ${timekeepingInDay.shift_hour_break_end}:${timekeepingInDay.shift_minute_break_end}:00`,
                                'YYYY/MM/DD HH:mm:ss',
                            );
                            // Tính tổng số phút nghỉ
                            minute_break_of_date = break_end_date.diff(break_start_date, 'minutes') || 0;
                            //check xem có check out trước giờ nghỉ hay không
                            let minute_checkin_to_break = break_start_date.diff(checkin_date, 'minutes');
                            let minute_checkin_to_checkout = checkout_date.diff(checkin_date, 'minutes');
                            // nếu check out trước giờ nghỉ trưa thì giờ làm không trừ giờ nghỉ
                            if (minute_checkin_to_break > minute_checkin_to_checkout) {
                                minute_break_of_date = 0;
                            }
                            // check xem có check in trong hoặc sau giờ nghỉ trưa hay không
                            let check_break_to_checkin = break_start_date.diff(checkin_date, 'minutes');
                            // nếu có thì giờ làm không trừ giờ nghỉ trưa
                            if (check_break_to_checkin <= 0) {
                                minute_break_of_date = 0;
                            }
                        }
                        // Số phút checkin trễ + số phút được phép trễ
                        minute_checkin_late =
                            checkin_date_user.diff(checkin_date, 'minutes')
                        // + timekeepingInDay.shift_minute_checkin_late * 1;
                        // Số phút checkout sớm + số phút được về sớm
                        minute_checkout_early =
                            checkout_date.diff(checkout_date_user, 'minutes')
                        // + timekeepingInDay.shift_minute_checkout_early * 1;
                        // Nếu số phút < 0 thì trễ hoặc sớm
                        if (minute_checkin_late < 0) minute_checkin_late = 0
                        if (minute_checkout_early < 0) minute_checkout_early = 0
                        // nếu nếu time check in là time của ca tăng ca thì note là TC
                        if (((0 < minute_checkin_late && minute_checkin_late < 30) || (0 < minute_checkout_early && minute_checkout_early < 30)) && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time)) {

                            item.total_check_in_late_to_30 += 1;
                            item.total_time_mistake_30 += 1;
                        } // Tổng số lần đi làm trễ dưới 30 phút
                        else if (minute_checkin_late >= 30 && minute_checkin_late <= 60 && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time)) {
                            item.total_check_in_late_from_30_to_60 += 1;
                            item.total_time_mistake_30_60 += 1;
                        } //Tổng số lần đi làm trễ từ 30 đến 60 phút
                        else if (minute_checkin_late > 60 && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time)) {
                            item.total_check_in_late_from_60 += 1;
                            item.total_time_mistake_60 += 1;
                        } //Tổng số lần đi trên trên 60 phút
                        if (0 < minute_checkout_early && minute_checkout_early < 30 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm)) {
                            item.total_check_out_early_to_30 += 1;
                            item.total_time_mistake_30 += 1;
                        } // Tổng số lần đi làm trễ dưới 30 phút
                        else if (minute_checkout_early >= 30 && minute_checkout_early <= 60 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm)) {
                            item.total_check_out_early_from_30_to_60 += 1;
                            item.total_time_mistake_30_60 += 1;
                        } //Tổng số lần đi làm trễ từ 30 đến 60 phút
                        else if (minute_checkout_early > 60 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm)) {
                            item.total_check_out_early_from_60 += 1;
                            item.total_time_mistake_60 += 1;
                        } //Tổng số lần đi trên trên 60 phút
                        // Tính tổng số phút làm việc trừ số phút nghỉ
                        minute_work_day = checkout_confirm_date.diff(checkin_confirm_date, 'minutes') - minute_break_of_date;
                        minute_work_day = minute_work_day < 0 ? 0 : minute_work_day;
                        if (timekeepingInDay?.is_support !== 1 && timekeepingInDay?.is_online !== 1) item.actual_working_point_total += +timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_online === 1) item.online_working_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_support === 1) item.support_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_training === 1) item.training_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_market_research === 1) item.market_research_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.off_work === 1) item.off_work_total += 1; // lấy trường issubtimeoff
                        if (timekeepingInDay?.off_work == 0) item.diff_off_work_total += 1;
                        if (timekeepingInDay?.is_holiday === 1) item.holiday_total += 1;
                        if (timekeepingInDay?.shift_is_over_time === 1 && !checkIsOffDay(days[j]) && timekeepingInDay.is_holiday !== 1 && timekeepingInDay?.is_office !== 1)
                            item.normal_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (timekeepingInDay?.shift_is_over_time === 1 && checkIsOffDay(days[j]))
                            item.offday_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (timekeepingInDay?.shift_is_over_time === 1 && timekeepingInDay.is_holiday === 1)
                            item.holiday_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (minute_work_day > timekeepingInDay?.shift_shift_time) {
                            item.hour_working_over_total += (Math.ceil((minute_work_day - timekeepingInDay.shift_shift_time) / 60)); // thời gian làm việc
                        }

                        if (timekeepingInDay?.is_office === 1 && timekeepingInDay?.shift_is_over_time)
                            item.hour_office_over_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                    }
                    if ((_days[j].number_of_col) > (_max_days[j].number_of_col || -1)) { _max_days[j].number_of_col = _days[j].number_of_col };
                }
                item.pay_working_point_total = item.actual_working_point_total + item.online_working_point_total + item.off_work_total
                    + item.holiday_total + item.diff_off_work_total + item.support_point_total + item.market_research_point_total + item.training_point_total;
                item.allowance_point_total = item.pay_working_point_total - item.off_work_total - item.holiday_total - item.diff_off_work_total;
                item.pay_working_point_month = item.pay_working_point_total;
                item.plus_working_point_month = (item.pay_working_point_month - item.standard_points_values) > 0 ? item.pay_working_point_month - item.standard_points_values : 0;
                // item.off_work_use_in_month = item.shift_number_of_work_day || 0;
                if (countIssportInday + item.actual_working_point_total > 14) {
                    item.off_work_use_in_month = item.shift_number_of_work_day
                } else {
                    item.off_work_use_in_month = 0
                }
                
                list_user.push(item);
                _days = [...days]
            }
            max_length_of_header = _max_days.reduce((acc, current) => acc + current.number_of_col, 0)
            return new ServiceResponse(true, '', { days: days, _days: _max_days, list_user: list_user, length_of_header: max_length_of_header - 1 });
        }
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getDataExport' });
        return new ServiceResponse(true, '', {
            timekeeping: [],
            summary: {},
        });
    }
};

const getDataExportMultipleUserTimeKeeping = async (query = {}) => {
    try {
        const pool = await mssql.pool;
        let users = apiHelper.getValueFromObject(query, 'users');
        users = users.join('|');
        const data = await pool
            .request()
            .input('USERNAME', users)
            .input('FROMDATE', apiHelper.getValueFromObject(query, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(query, 'to_date'))
            .execute('HR_USER_TIMEKEEPING_ExportMultipleUser_V3_AdminWeb');
        let timekeeping = timeKeepingClass.timeKeepingExcel(data.recordset);

        let countIssportInday
        if (data.recordset.length > 0) {
            countIssportInday = countUniqueSupportDates(data.recordset)
        }
     
        if (apiHelper.getValueFromObject(query, 'type') === 1) { // Dạng danh sách
            let days = _.orderBy(Object.keys(_.groupBy(timekeeping, 'date_in_month')), (x) => x, ['asc']);
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            for (const key in user) {
                let item = {
                    user_name: key,
                    full_name: _.find(user[key], (x) => x.user_name === key)?.full_name,
                    business_name: _.find(user[key], (x) => x.user_name === key)?.business_name,
                    working: [],
                    working_day: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.is_working_day ? x.shift_number_of_work_day : 0)),
                        0,
                    ),
                };
                for (const day of days) {
                    item.working.push({
                        date_in_month: day,
                        checkin_time: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkin_time,
                        checkout_time: _.findLast(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkout_time,
                        checkin_time_confirm: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkin_time_confirm,
                        checkout_time_confirm: _.find(timekeeping, (o) => o.user_name === key && o.date_in_month === day)
                            ?.checkout_time_confirm,
                    });
                }
                list_user.push(item);
            }
            return new ServiceResponse(true, '', { days: days, list_user: list_user });
        } else if (apiHelper.getValueFromObject(query, 'type') === 2) { // Dạng danh bảng
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            const d = moment().format('YYYY/MM/DD');
            for (const property in user) {
                let item = {
                    total_working: 0, // tổng tất cả các công làm
                    total_working_online: 0, // tổng công online
                    total_working_holiday: 0, // tổng công ngày nghỉ
                    total_not_working_holiday: 0, // tổng công không làm ngày nghỉ
                    total_not_time_keeping: 0, // tổng quên chấm công
                    total_check_in_late_to_30: 0, // tổng số lần đi muộn dưới 30 phú
                    total_check_in_late_from_30_to_60: 0, // tổng số lần đi muộn từ 30 p đến 60p
                    total_check_in_late_from_60: 0, // tổng số lần đi mượn hơn 60p
                    business_name: null, //
                    full_name: null, //
                    position_name: null,
                    working_day: 0, // số ngày đi làm
                    note: '',
                };
                const d = moment().format('YYYY/MM/DD');
                for (let index = 0; index < user[property].length; index++) {
                    const element = user[property][index];
                    if (element.is_working_day) {
                        if (element.is_holiday) {
                            if (element.time_keeping) {
                                item.total_working_holiday += 1; // Tổng công làm ngày lễ
                            } else item.total_not_working_holiday += 1; //Tổng công không làm ngày lễ
                        }
                        if (element.is_online) item.total_working_online += 1; //Tổng công online
                    }
                    if (element.schedule_id && !element.timekeeping_date && !element.is_holiday && !element.is_offwork) item.total_not_time_keeping += 1; // Tổng số lần quên chấm công

                    item.business_name = element.business_name;
                    item.full_name = element.full_name;
                    item.position_name = element.position_name;
                    // Tạo ngày tháng checkin và checkout (YYYY/MM/DD HH:mm:ss)
                    const checkin_date = moment(`${d} ${element.checkin_time_confirm ?? element.checkin_time}`, 'YYYY/MM/DD HH:mm:ss');
                    const checkout_date = moment(`${d} ${element.checkout_time_confirm ?? element.checkout_time}`, 'YYYY/MM/DD HH:mm:ss');

                    let minute_break_of_date = 0,
                        minute_work_day = 0,
                        minute_checkin_late = 0,
                        minute_checkout_early = 0,
                        minute_working_date = 0,
                        working_day,
                        minute_late = 0,
                        minute_early = 0,
                        checkin_late = 0,
                        checkout_early,
                        note = '';
                    // Nếu có giờ nghỉ thì tính số phút nghỉ
                    if (
                        (element.shift_hour_break_start > 0 || element.shift_minute_break_start > 0) &&
                        (element.shift_hour_break_end > 0 || element.shift_minute_break_end > 0)
                    ) {
                        // Tạo giờ nghỉ bắt đầu và kết thúc (theo ngày) (YYYY/MM/DD HH:mm:ss)
                        const break_start_date = moment(
                            `${d} ${element.shift_hour_break_start}:${element.shift_minute_break_start}:00`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const break_end_date = moment(
                            `${d} ${element.shift_hour_break_end}:${element.shift_minute_break_end}:00`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        // Tính tổng số phút nghỉ
                        minute_break_of_date = break_end_date.diff(break_start_date, 'minutes');
                        //check xem có check out trước giờ nghỉ hay không
                        let minute_checkin_to_break = break_start_date.diff(checkin_date, 'minutes');
                        let minute_checkin_to_checkout = checkout_date.diff(checkin_date, 'minutes');
                        // nếu check out trước giờ nghỉ trưa thì giờ làm không trừ giờ nghỉ
                        if (minute_checkin_to_break > minute_checkin_to_checkout) {
                            minute_break_of_date = 0;
                        }
                        // check xem có check in trong hoặc sau giờ nghỉ trưa hay không
                        let check_break_to_checkin = break_start_date.diff(checkin_date, 'minutes');
                        // nếu có thì giờ làm không trừ giờ nghỉ trưa
                        if (check_break_to_checkin <= 0) {
                            minute_break_of_date = 0;
                        }
                    }
                    // Tính tổng số phút làm việc trừ số phút nghỉ
                    minute_work_day = checkout_date.diff(checkin_date, 'minutes') - minute_break_of_date;
                    minute_work_day = minute_work_day < 0 ? 0 : minute_work_day;
                    minute_working_date += minute_work_day || 0;
                    // Tính công làm việc , lấy tổng thời gian thực tế * số công ca / thời gian của ca làm việc
                    let number_of_work_day = (minute_work_day * element.shift_number_of_work_day) / (element.shift_shift_time || 1);
                    working_day =
                        number_of_work_day > element.shift_number_of_work_day
                            ? element.shift_number_of_work_day
                            : Number(number_of_work_day).toFixed(2);
                    // Tính số phút đi trễ và vế sớm
                    const checkin_late_date = moment(
                        `${d} ${element.shift_hour_checkin}:${element.shift_minute_checkin}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );
                    const checkout_early_date = moment(
                        `${d} ${element.shift_hour_checkout}:${element.shift_minute_checkout}:00`,
                        'YYYY/MM/DD HH:mm:ss',
                    );

                    // Số phút checkin trễ + số phút được phép trễ
                    minute_checkin_late =
                        checkin_late_date.diff(checkin_date, 'minutes') + element.shift_minute_checkin_late * 1;

                    // Số phút checkout sớm + số phút được về sớm
                    minute_checkout_early =
                        checkout_date.diff(checkout_early_date, 'minutes') + element.shift_minute_checkout_early * 1;

                    // Nếu số phút < 0 thì trễ hoặc sớm
                    if (minute_checkin_late < 0) minute_late = Math.abs(minute_checkin_late);
                    if (minute_checkout_early < 0) minute_early = Math.abs(minute_checkout_early);
                    // nếu nếu time check in là time của ca tăng ca thì note là TC
                    if (minute_checkin_late < 30 || minute_checkout_early < 30) item.total_check_in_late_to_30 += 1; // Tổng số lần đi làm trễ dưới 30 phút
                    if (minute_checkin_late >= 30 && minute_checkin_late <= 60)
                        item.total_check_in_late_from_30_to_60 += 1; //Tổng số lần đi làm trễ từ 30 đến 60 phút
                    if (minute_checkin_late > 60) item.total_check_in_late_from_60 += 1; //Tổng số lần đi trên trên 60 phút
                    minute_working_date = minute_working_date * 1;
                    minute_late = checkin_late * 1 || 0;
                    minute_early = checkout_early * 1 || 0;
                    working_day = working_day * 1;
                    item.working_day += working_day;
                    if (element.shift_is_over_time) {
                        if (element.is_holiday) {
                            note = 'TC lễ';
                        } else {
                            note = 'TC';
                        }
                    } else if (element.is_holiday) {
                        note = 'Lễ';
                    } else if (element.is_offwork) {
                        note = 'P';
                    } else {
                        note = '';
                    }
                    item.note = note;
                }
                list_user.push({ ...item, schedule: user[property] });
            }
            return new ServiceResponse(true, 'ok', { list_user });
        } else if (apiHelper.getValueFromObject(query, 'type') === 3) { // Dạng danh mới bên shopdunk
            let days = _.orderBy(Object.keys(_.groupBy(timekeeping, 'date_in_month')), (x) => x, ['asc']);
            let user = _.groupBy(
                timekeeping.filter((x) => x.user_name),
                'user_name',
            );
            let list_user = [];
            let length_of_header = 0;
            let max_length_of_header = 0;
            let _days = [...days];
            let _max_days = [...days];
            _max_days = _max_days.map((date) => ({
                day: date,
                number_of_col: 0
            }));
            for (const key in user) {
                let item = {
                    total_time: _.find(user[key], (x) => x.user_name === key)?.total_time,
                    is_time_keeping: _.find(user[key], (x) => x.user_name === key)?.is_time_keeping,
                    user_name: key,
                    full_name: _.find(user[key], (x) => x.user_name === key)?.full_name,
                    business_name: _.find(user[key], (x) => x.user_name === key)?.business_name,
                    working: [],
                    position_name: _.find(user[key], (x) => x.user_name === key)?.position_name,
                    entry_date: _.find(user[key], (x) => x.user_name === key)?.entry_date,
                    shift_number_of_work_day: _.find(user[key], (x) => x.user_name === key)?.shift_number_of_work_day,
                    working_day: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.is_working_day ? x.shift_number_of_work_day : 0)),
                        0,
                    ),
                    standard_points_values: _.find(user[key], (x) => x.user_name === key)?.standard_points_values, // công tiêu chuẩn
                    time_can_off: _.find(user[key], (x) => x.user_name === key)?.time_can_off,
                    total_time_off: _.find(user[key], (x) => x.user_name === key)?.total_time_off,
                    department_name: _.find(user[key], (x) => x.user_name === key)?.department_name,
                    block_name: _.find(user[key], (x) => x.user_name === key)?.block_name,
                    actual_working_point_total: 0, // công làm thực tế
                    online_working_point_total: 0, // công online
                    support_point_total: 0, //công hỗ trợ
                    training_point_total: 0, // công đào tạo
                    market_research_point_total: 0, // công thị trường
                    off_work_total: 0, //nghỉ phép
                    holiday_total: 0, // nghỉ lễ
                    diff_off_work_total: 0, // nghỉ khác
                    pay_working_point_total: 0, // tổng công hưởng lương
                    allowance_point_total: 0, // tổng công hưởng phụ cấp (tổng công hưởng lương - nghỉ phép - nghỉ lễ - nghỉ khác)
                    standard_work: 0, // công tiêu chuẩn
                    pay_working_point_month: 0, // tổng công hưởng lương tháng này  =  tổng công hưởng lương
                    plus_working_point_month: 0, // Tổng công hưởng thêm tháng này = (tổng công hưởng lương - công tiêu chuẩn)
                    total_check_in_late_to_30: 0, // tổng số lần đi muộn dưới 30 phú
                    total_check_in_late_from_30_to_60: 0, // tổng số lần đi muộn từ 30 p đến 60p
                    total_check_in_late_from_60: 0, // tổng số lần đi muộn hơn 60p
                    total_check_out_early_to_30: 0, // tổng số lần về sớm dưới 30 phú
                    total_check_out_early_from_30_to_60: 0, // tổng số lần về sớm từ 30 p đến 60p
                    total_check_out_early_from_60: 0, // tổng số lần về sớm hơn 60p
                    total_time_mistake_30: 0, // cộng lần phạm lỗi trong mốc dưới 30 p (ca QC thì không cần quan tâm )
                    total_time_mistake_30_60: 0, // cộng lần phạm lỗi trong mốc từ 30 p đến 60
                    total_time_mistake_60: 0, // cộng lần phạm lỗi trong mốc trên 60p
                    normal_time_ot_total: 0, // tổng thời gian ca OT ngày thường
                    offday_time_ot_total: 0, // tổng thời gian ca OT ngày nghỉ ( đi làm vào thứ 7, CN trong đó có số ngày là ngày chẵn)
                    holiday_time_ot_total: 0, // tổng thời gian ca OT ngày lễ
                    hour_working_over_total: 0, // tổng thời gian trong ca có thời gian làm vượt hơn 8 tiếng: ví dụ ca C1020 kéo dài 10 tiếng / Nhân sự làm 5 ca trong tháng / thời gian vượt ca là : (10-8)*5
                    hour_office_over_total: 0, // tống số giờ làm thêm đối với nhân sự là khối văn phòng
                    // off_work_total: 0,
                    off_work_use_in_month: 0, // phép sử dụng trong tháng  
                    // off_work_left: 0,
                    boundary_point_total: 0, // công định biên
                    store: _.find(user[key], (x) => x.user_name === key)?.store,
                    miss_time: _.reduce(
                        user[key],
                        (total, x, index) => (total = total + (x.miss_time)),
                        0,
                    ),
                };
                for (let j = 0; j < days.length; j++) {
                    // lặp qua ngày và xử lý logic đếm
                    const d = moment().format('YYYY/MM/DD');
                    _days[j] = { day: days[j], number_of_col: 0 };
                    const shifts =
                        timekeeping.filter((item) => item.date_in_month === days[j] && item.user_name === key) || [];
                    for (let i = 0; i < shifts.length; i++) {
                        const timekeepingInDay = _.filter(
                            timekeeping,
                            (o) => o.user_name === key && o.date_in_month === days[j],
                        )[i];
                        // lặp qua số ca trong ngày
                        _days[j].number_of_col += 2;
                        if (timekeepingInDay.is_break_shift == 1) {
                            // ca gãy thì cộng thêm 2 cột nữa
                            length_of_header += 2;
                            _days[j].number_of_col += 2;
                        }
                        length_of_header += 2;
                        item.working.push({
                            //push thông tin ngày ca làm việc theo ngày
                            date_in_month: days[j],
                            checkin_time: timekeepingInDay?.checkin_time,
                            checkout_time: timekeepingInDay?.checkout_time,
                            checkin_time_confirm: timekeepingInDay?.checkin_time_confirm,
                            checkout_time_confirm: timekeepingInDay?.checkout_time_confirm,
                            checkout_break_time: timekeepingInDay?.checkout_break_time,
                            checkin_break_time: timekeepingInDay?.checkin_break_time,
                            is_check_store: timekeepingInDay?.is_check_store,
                            is_break_shift: timekeepingInDay?.is_break_shift,
                            is_online: timekeepingInDay?.is_online,
                            is_support: timekeepingInDay?.is_support,
                            is_training: timekeepingInDay?.is_training,
                            is_market_research: timekeepingInDay?.is_market_research,
                            total_time_confirm: timekeepingInDay?.total_time_confirm,
                            shift_is_over_time: timekeepingInDay?.shift_is_over_time,
                            is_holiday: timekeepingInDay?.is_holiday,
                            is_offwork: timekeepingInDay?.is_offwork,
                            work_time: (timekeepingInDay?.work_time && !timekeepingInDay?.is_support ? timekeepingInDay?.work_time : 0),
                        });
                        //Xử lý logic: ( có 3 loại ca: ca thường, ca gãy, ca QC)
                        let shift_shift_time = -1;
                        if (
                            timekeepingInDay.is_online !== 1 &&
                            timekeepingInDay.is_support !== 1 &&
                            timekeepingInDay.is_training !== 1 &&
                            timekeepingInDay.is_market_research !== 1 &&
                            timekeepingInDay.off_work == undefined &&
                            timekeepingInDay.is_holiday !== 1
                        ) {
                            //handle 3 loại ca: ca thường, ca gãy, ca QC
                            shift_shift_time = timekeepingInDay.shift_shift_time || 0; // thời gian của ca làm việc
                        }
                        // Tạo ngày tháng checkin và checkout theo quy định của ca làm việc(YYYY/MM/DD HH:mm:ss)
                        const checkin_date = moment(
                            `${d} ${timekeepingInDay?.stime_start}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const checkout_date = moment(
                            `${d} ${timekeepingInDay?.stime_end}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        // tạo thời gian checkin // nếu không có checkin sẽ lấy thời gian confirm
                        const checkin_date_user = moment(`${d} ${timekeepingInDay.checkin_time ?? timekeepingInDay.checkin_time_confirm}`, 'YYYY/MM/DD HH:mm:ss'); // Lấy theo thời gian confirm
                        const checkout_date_user = moment(`${d} ${timekeepingInDay.checkout_time ?? timekeepingInDay.checkout_time_confirm}`, 'YYYY/MM/DD HH:mm:ss');
                        //checkin_time_confirm ?? checkin_time
                        // Tính số phút làm việc
                        const checkin_confirm_date = moment(
                            `${d} ${timekeepingInDay.checkin_time_confirm ?? timekeepingInDay.checkin_time}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        const checkout_confirm_date = moment(
                            `${d} ${timekeepingInDay.checkout_time_confirm ?? timekeepingInDay.checkout_time}`,
                            'YYYY/MM/DD HH:mm:ss',
                        );
                        let minute_break_of_date = 0,
                            minute_work_day = 0,
                            minute_checkin_late = 0,
                            minute_checkout_early = 0;
                        // minute_working_date = 0,
                        // checkin_late = 0,
                        // checkout_early = 0;
                        // Nếu có giờ nghỉ thì tính số phút nghỉ
                        if (
                            (timekeepingInDay.shift_hour_break_start > 0 ||
                                timekeepingInDay.shift_minute_break_start > 0) &&
                            (timekeepingInDay.shift_hour_break_end > 0 || timekeepingInDay.shift_minute_break_end > 0)
                        ) {
                            // Tạo giờ nghỉ bắt đầu và kết thúc (theo ngày) (YYYY/MM/DD HH:mm:ss)
                            const break_start_date = moment(
                                `${d} ${timekeepingInDay.shift_hour_break_start}:${timekeepingInDay.shift_minute_break_start}:00`,
                                'YYYY/MM/DD HH:mm:ss',
                            );
                            const break_end_date = moment(
                                `${d} ${timekeepingInDay.shift_hour_break_end}:${timekeepingInDay.shift_minute_break_end}:00`,
                                'YYYY/MM/DD HH:mm:ss',
                            );
                            // Tính tổng số phút nghỉ
                            minute_break_of_date = break_end_date.diff(break_start_date, 'minutes') || 0;
                            //check xem có check out trước giờ nghỉ hay không
                            let minute_checkin_to_break = break_start_date.diff(checkin_date, 'minutes');
                            let minute_checkin_to_checkout = checkout_date.diff(checkin_date, 'minutes');
                            // nếu check out trước giờ nghỉ trưa thì giờ làm không trừ giờ nghỉ
                            if (minute_checkin_to_break > minute_checkin_to_checkout) {
                                minute_break_of_date = 0;
                            }
                            // check xem có check in trong hoặc sau giờ nghỉ trưa hay không
                            let check_break_to_checkin = break_start_date.diff(checkin_date, 'minutes');
                            // nếu có thì giờ làm không trừ giờ nghỉ trưa
                            if (check_break_to_checkin <= 0) {
                                minute_break_of_date = 0;
                            }
                        }
                        // Số phút checkin trễ + số phút được phép trễ
                        minute_checkin_late =
                            checkin_date_user.diff(checkin_date, 'minutes')
                        // + timekeepingInDay.shift_minute_checkin_late * 1;
                        // Số phút checkout sớm + số phút được về sớm
                        minute_checkout_early =
                            checkout_date.diff(checkout_date_user, 'minutes')
                        // + timekeepingInDay.shift_minute_checkout_early * 1;
                        // Nếu số phút < 0 thì trễ hoặc sớm
                        if (minute_checkin_late || (item.total_time_off > 0) < 0) minute_checkin_late = 0
                        if ((minute_checkout_early < 0) || item.total_time_off) minute_checkout_early = 0
                        // nếu nếu time check in là time của ca tăng ca thì note là TC
                        if (((0 < minute_checkin_late && minute_checkin_late < 30) || (0 < minute_checkout_early && minute_checkout_early < 30)) && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time) && item.total_time_off > 0) {

                            item.total_check_in_late_to_30 += 1;
                            item.total_time_mistake_30 += 1;
                        } // Tổng số lần đi làm trễ dưới 30 phút
                        else if (minute_checkin_late >= 30 && minute_checkin_late <= 60 && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time) && item.total_time_off > 0) {
                            item.total_check_in_late_from_30_to_60 += 1;
                            item.total_time_mistake_30_60 += 1;
                        } //Tổng số lần đi làm trễ từ 30 đến 60 phút
                        else if (minute_checkin_late > 60 && (timekeepingInDay.checkin_time_confirm || timekeepingInDay.checkin_time) && item.total_time_off > 0) {
                            item.total_check_in_late_from_60 += 1;
                            item.total_time_mistake_60 += 1;
                        } //Tổng số lần đi trên trên 60 phút
                        if (0 < minute_checkout_early && minute_checkout_early < 30 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm) && item.total_time_off > 0) {
                            item.total_check_out_early_to_30 += 1;
                            item.total_time_mistake_30 += 1;
                        } // Tổng số lần đi làm trễ dưới 30 phút
                        else if (minute_checkout_early >= 30 && minute_checkout_early <= 60 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm) && item.total_time_off > 0) {
                            item.total_check_out_early_from_30_to_60 += 1;
                            item.total_time_mistake_30_60 += 1;
                        } //Tổng số lần đi làm trễ từ 30 đến 60 phút
                        else if (minute_checkout_early > 60 && (timekeepingInDay.checkout_time_confirm || timekeepingInDay.checkout_confirm) && item.total_time_off > 0) {
                            item.total_check_out_early_from_60 += 1;
                            item.total_time_mistake_60 += 1;
                        } //Tổng số lần đi trên trên 60 phút
                        // Tính tổng số phút làm việc trừ số phút nghỉ
                        minute_work_day = checkout_confirm_date.diff(checkin_confirm_date, 'minutes') - minute_break_of_date;
                        minute_work_day = minute_work_day < 0 ? 0 : minute_work_day;
                        if (timekeepingInDay?.is_support !== 1 && timekeepingInDay?.is_online !== 1) item.actual_working_point_total += +timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_online === 1) item.online_working_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_support === 1) item.support_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_training === 1) item.training_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.is_market_research === 1) item.market_research_point_total += timekeepingInDay.work_time;
                        if (timekeepingInDay?.off_work === 1) item.off_work_total += 1; // lấy trường issubtimeoff
                        if (timekeepingInDay?.off_work == 0) item.diff_off_work_total += 1;
                        if (timekeepingInDay?.is_holiday === 1) item.holiday_total += 1;
                        if (timekeepingInDay?.shift_is_over_time === 1 && !checkIsOffDay(days[j]) && timekeepingInDay.is_holiday !== 1 && timekeepingInDay?.is_office !== 1)
                            item.normal_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (timekeepingInDay?.shift_is_over_time === 1 && checkIsOffDay(days[j]))
                            item.offday_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (timekeepingInDay?.shift_is_over_time === 1 && timekeepingInDay.is_holiday === 1)
                            item.holiday_time_ot_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                        if (minute_work_day > timekeepingInDay?.shift_shift_time) {
                            item.hour_working_over_total += (Math.ceil((minute_work_day - timekeepingInDay.shift_shift_time) / 60)); // thời gian làm việc
                        }

                        if (timekeepingInDay?.is_office === 1 && timekeepingInDay?.shift_is_over_time)
                            item.hour_office_over_total += Math.ceil((timekeepingInDay?.shift_shift_time / 60));
                    }
                    if ((_days[j].number_of_col) > (_max_days[j].number_of_col || -1)) { _max_days[j].number_of_col = _days[j].number_of_col };
                }
                item.pay_working_point_total = item.actual_working_point_total + item.online_working_point_total + item.off_work_total
                    + item.holiday_total + item.diff_off_work_total + item.support_point_total + item.market_research_point_total + item.training_point_total;
                item.allowance_point_total = item.pay_working_point_total - item.off_work_total - item.holiday_total - item.diff_off_work_total;
                item.pay_working_point_month = item.pay_working_point_total;
                item.plus_working_point_month = (item.pay_working_point_month - item.standard_points_values) > 0 ? item.pay_working_point_month - item.standard_points_values : 0;
                // item.off_work_use_in_month = item.shift_number_of_work_day || 0;
                if (countIssportInday + item.actual_working_point_total > 14) {
                    item.off_work_use_in_month = item.shift_number_of_work_day
                } else {
                    item.off_work_use_in_month = 0
                }
               
                list_user.push(item);
                _days = [...days]
            }
            max_length_of_header = _max_days.reduce((acc, current) => acc + current.number_of_col, 0)
            return new ServiceResponse(true, '', { days: days, _days: _max_days, list_user: list_user, length_of_header: max_length_of_header - 1 });
        }
    } catch (e) {
        logger.error(e, { function: 'scheduleService.getDataExport' });
        return new ServiceResponse(true, '', {
            timekeeping: [],
            summary: {},
        });
    }
};

const exportExcelMultipleUser = async (bodyParams = {}) => {
    try {
        let query = apiHelper.getValueFromObject(bodyParams, 'query');
        const users = apiHelper.getValueFromObject(bodyParams, 'users');
        //Kiểm tra xem có phải là export toàn bộ user không
        // ==> nếu là export toàn bột nhân viên
        // ==> tạo 1 file csv lưu thông tin của giữ liệu nhân viên đã xuất

        // Kiem tra xem export mot nhan vien hay nhieu nhan vien
        // Lấy dữ liệu export
        const dataRes = await getDataExportMultipleUser({
            from_date: query.date_from,
            to_date: query.date_to,
            users: (users || []).map((x) => x.user_name),
            type: 3,
        });

        const user_name_list = (users || []).map((x) => x.user_name);
        if (dataRes.isFailed()) return new ServiceResponse(false, dataRes.getErrors());
        // Khai bao style cho excel
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
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
                    right: {
                        style: 'thin',
                    },
                },
            },
        };
        //Tạo sheet chấm công
        let wb = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });
        let ws = null;
        if (apiHelper.getValueFromObject(query, 'type') === 1) {
            let { days, list_user } = dataRes.getData();
            let data = _.groupBy(list_user, 'business_name');
            ws = wb.addWorksheet('shop');
            ws.cell(2, 1, 2, 5 + days.length, true)
                .string('BẢNG THỐNG KÊ CHẤM CÔNG')
                .style(styles.header);
            ws.cell(3, 1, 3, 5 + days.length, true)
                .string(`Từ ngày ${days[0]} đến ngày ${days[days.length - 1]}`)
                .style(styles.header);
            ws.cell(4, 1, 5, 1, true).string('STT').style(styles.body_center);
            ws.cell(4, 2, 5, 2, true).string('Mã nhân viên').style(styles.body_center);
            ws.cell(4, 3, 5, 3, true).string('Tên nhân viên').style(styles.body_center);
            ws.cell(4, 4, 5, 4, true).string('').style(styles.body_center);
            const weekdate = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
            let row = 6;
            for (let i = 0; i < days.length; i++) {
                const day_off_week = weekdate[moment(days[i], 'DD/MM/YYYY').weekday()];
                ws.cell(4, 5 + i)
                    .string(`${days[i]}`)
                    .style(styles.body_center);
                ws.cell(5, 5 + i)
                    .string(`${day_off_week}`)
                    .style(styles.body_center);
            }
            ws.cell(4, 5 + days.length, 5, 5 + days.length, true)
                .string('Ngày công')
                .style(styles.body_center);
            let index = 1;
            // body của file excel
            for (const key in data) {
                ws.cell(row, 1, row, 5 + days.length, true).string(`${key}`);
                row += 1;
                for (const user of data[key]) {
                    ws.cell(row, 1, row + 1, 1, true)
                        .number(index)
                        .style(styles.body_center);
                    ws.cell(row, 2, row + 1, 2, true)
                        .string(`${user.user_name}`)
                        .style(styles.body_center);
                    ws.cell(row, 3, row + 1, 3, true)
                        .string(`${user.full_name}`)
                        .style(styles.body_center);
                    ws.cell(row, 4).string('Vào').style(styles.body_center);
                    ws.cell(row + 1, 4)
                        .string('Ra')
                        .style(styles.body_center);
                    for (let i = 0; i < user.working.length; i++) {
                        const element = user.working[i];
                        ws.cell(row, 5 + i)
                            .string(`${element.checkin_time_confirm ? element.checkin_time_confirm : 'V'}`)
                            .style({
                                ...styles.body_center,
                                border: {
                                    ...styles.body_center.border,
                                    bottom: {
                                        style: 'none',
                                    },
                                },
                            });
                        ws.cell(row + 1, 5 + i)
                            .string(`${element.checkout_time_confirm ? element.checkout_time_confirm : 'V'}`)
                            .style({
                                ...styles.body_center,
                                border: {
                                    ...styles.body_center.border,
                                    top: {
                                        style: 'none',
                                    },
                                },
                            });
                    }
                    ws.cell(row, 5 + days.length, row + 1, 5 + days.length, true)
                        .number(user.working_day)
                        .style(styles.body_center);
                    row += 2;
                    index += 1;
                }
            }
        } else if (apiHelper.getValueFromObject(query, 'type') === 2 && !user_name_list.includes('ALL')) {
            const { list_user } = dataRes.getData();
            ws = wb.addWorksheet('Shop');
            ws.cell(2, 1, 2, 13, true)
                .string(
                    `TỔNG HỢP SHOPDUNK ${query.date_from
                        ? moment(query.date_from, 'DD/MM/YYYY').format('MM/YYYY')
                        : moment().format('MM/YYYY')
                    }`,
                )
                .style(styles.header);
            ws.cell(3, 1, 4, 1, true).string('STT').style(styles.bold_center);
            ws.cell(3, 2, 4, 2, true).string('CHI NHÁNH').style(styles.bold_center);
            ws.cell(3, 3, 4, 3, true).string('TÊN NHÂN SỰ').style(styles.bold_center);
            ws.cell(3, 4, 4, 4, true).string('VỊ TRÍ').style(styles.bold_center);
            ws.cell(3, 5, 4, 5, true).string('CÔNG VIỆC THỰC TÊ').style(styles.bold_center);
            ws.cell(3, 6, 3, 7, true).string('NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(4, 6).string('CÔNG NGHỈ NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(4, 7).string('CÔNG ĐI LÀM NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(3, 8, 4, 8, true).string('SỐ CÔNG QUÊN CHẤM CÔNG').style(styles.bold_center);
            ws.cell(3, 9, 3, 11, true).string('SỐ LẦN ĐI LÀM MUỘN').style(styles.bold_center);
            ws.cell(4, 9).string("<30'").style(styles.bold_center);
            ws.cell(4, 10).string("30 - 60'").style(styles.bold_center);
            ws.cell(4, 11).string(">60'").style(styles.bold_center);
            ws.cell(3, 12, 4, 12, true).string('CÔNG BỔ SUNG').style(styles.bold_center);
            ws.cell(3, 13, 4, 13, true).string('GIẢI TRÌNH').style(styles.bold_center);
            const list_business = _.groupBy(list_user, 'business_name');
            let index = 5;
            let position = 1;
            for (const key in list_business) {
                let item = list_business[key];
                ws.cell(index, 2, index + item.length - 1, 2, true)
                    .string(`${key}`)
                    .style(styles.body_center);
                for (const user of item) {
                    ws.cell(index, 1).string(`${position}`).style(styles.body_center);
                    ws.cell(index, 3).string(`${user.full_name}`).style(styles.body_center);
                    ws.cell(index, 4).string(`${user.position_name}`).style(styles.body_center);
                    ws.cell(index, 5).number(user.total_working).style(styles.body_center);
                    ws.cell(index, 6).number(user.total_not_working_holiday).style(styles.body_center);
                    ws.cell(index, 7).number(user.total_working_holiday).style(styles.body_center);
                    ws.cell(index, 8).number(user.total_not_time_keeping).style(styles.body_center);
                    ws.cell(index, 9).number(user.total_check_in_late_to_30).style(styles.body_center);
                    ws.cell(index, 10).number(user.total_check_in_late_from_30_to_60).style(styles.body_center);
                    ws.cell(index, 11).number(user.total_check_in_late_from_60).style(styles.body_center);
                    ws.cell(index, 12).number(0).style(styles.body_center);
                    ws.cell(index, 13).string('').style(styles.body_center);
                    position += 1;
                    index += 1;
                }
            }
        } else if (apiHelper.getValueFromObject(query, 'type') === 2 && user_name_list.includes('ALL')) {
            const { list_user } = dataRes.getData();
            ws = wb.addWorksheet('CC VP');
            ws.cell(2, 1, 2, 13, true)
                .string(
                    `CHẤM CÔNG KHỐI VĂN PHÒNG SHOPDUNK - ${query.date_from
                        ? moment(query.date_from, 'DD/MM/YYYY').format('MM/YYYY')
                        : moment().format('MM/YYYY')
                    }`,
                )
                .style(styles.header);
            ws.cell(3, 1, 4, 1, true).string('STT').style(styles.bold_center);
            ws.cell(3, 2, 4, 2, true).string('CHI NHÁNH').style(styles.bold_center);
            ws.cell(3, 3, 4, 3, true).string('TÊN NHÂN SỰ').style(styles.bold_center);
            ws.cell(3, 4, 4, 4, true).string('VỊ TRÍ').style(styles.bold_center);
            ws.cell(3, 5, 4, 5, true).string('CÔNG LÀM THỰC TÊ').style(styles.bold_center);
            ws.cell(3, 6, 3, 7, true).string('NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(4, 6).string('CÔNG NGHỈ NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(4, 7).string('CÔNG ĐI LÀM NGÀY LỄ/TẾT').style(styles.bold_center);
            ws.cell(3, 8, 4, 8, true).string('SỐ CÔNG QUÊN CHẤM CÔNG').style(styles.bold_center);
            ws.cell(3, 9, 4, 9, true).string('TỔNG CÔNG').style(styles.bold_center);
            ws.cell(3, 10, 3, 12, true).string('SỐ LẦN ĐI LÀM MUỘN').style(styles.bold_center);
            ws.cell(4, 10).string("<30'").style(styles.bold_center);
            ws.cell(4, 11).string("30 - 60'").style(styles.bold_center);
            ws.cell(4, 12).string(">60'").style(styles.bold_center);
            ws.cell(3, 13, 4, 13, true).string('CÔNG BỔ SUNG').style(styles.bold_center);
            ws.cell(3, 14, 4, 14, true).string('GIẢI TRÌNH').style(styles.bold_center);
            const list_business = _.groupBy(list_user, 'business_name');
            let index = 5;
            let position = 1;
            for (const key in list_business) {
                let item = list_business[key];
                ws.cell(index, 2, index + item.length - 1, 2, true)
                    .string(`${key}`)
                    .style(styles.body_center);
                for (const user of item) {
                    ws.cell(index, 1).string(`${position}`).style(styles.body_center);
                    ws.cell(index, 3).string(`${user.full_name}`).style(styles.body_center);
                    ws.cell(index, 4).string(`${user.position_name}`).style(styles.body_center);
                    ws.cell(index, 5).number(user.working_day).style(styles.body_center);
                    ws.cell(index, 6).number(user.total_not_working_holiday).style(styles.body_center);
                    ws.cell(index, 7).number(user.total_working_holiday).style(styles.body_center);
                    ws.cell(index, 8).number(user.total_not_time_keeping).style(styles.body_center);
                    ws.cell(index, 9).number(user.working_day + user.total_not_working_holiday + user.total_working_holiday).style(styles.body_center);
                    ws.cell(index, 10).number(user.total_check_in_late_to_30).style(styles.body_center);
                    ws.cell(index, 11).number(user.total_check_in_late_from_30_to_60).style(styles.body_center);
                    ws.cell(index, 12).number(user.total_check_in_late_from_60).style(styles.body_center);
                    ws.cell(index, 13).number(0).style(styles.body_center);
                    ws.cell(index, 14).string(user.note).style(styles.body_center);
                    position += 1;
                    index += 1;
                }
            }
        } else {
            const { days, _days, list_user, length_of_header } = dataRes.getData();
            ws = wb.addWorksheet('Chấm công');
            //HEADER
            // Common css
            ws.column(4).freeze();
            ws.column(3).setWidth(25);
            ws.column(4).setWidth(25);
            ws.row(3).setHeight(35);
            ws.row(4).setHeight(50);
            ws.cell(2, 1, 4, 1, true)
                .string('STT')
                .style(styles.bold_center);
            ws.cell(2, 2, 4, 2, true)
                .string('MNV')
                .style(styles.bold_center);
            ws.cell(2, 3, 4, 3, true)
                .string('HỌ VÀ TÊN')
                .style(styles.bold_center);
            ws.cell(2, 4, 4, 4, true)
                .string('CHỨC VỤ')
                .style(styles.bold_center);
            ws.cell(2, 5, 4, 5, true)
                .string('NGÀY VÀO LÀM VIỆC')
                .style(styles.bold_center);
            ws.cell(2, 6, 4, 6, true)
                .string('CỬA HÀNG')
                .style(styles.bold_center);
            ws.cell(2, 7, 4, 7, true)
                .string('Phòng ban')
                .style(styles.bold_center);
            ws.cell(2, 8, 4, 8, true)
                .string('Khối')
                .style(styles.bold_center);
            ws.cell(2, 9, 2, 9 + length_of_header, true)
                .string('Chấm công hàng ngày')
                .style(styles.bold_center);
            ws.cell(2, 10 + length_of_header, 2, 20 + length_of_header, true)
                .string('KẾT QUẢ CÔNG')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(3, 10 + length_of_header, 4, 10 + length_of_header, true)
                .string('Công làm việc thực tế')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(3, 11 + length_of_header, 4, 11 + length_of_header, true)
                .string('Công Online')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(3, 12 + length_of_header, 4, 12 + length_of_header, true)
                .string('Hỗ trợ')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: 'yellow',
                    },
                });
            ws.cell(3, 13 + length_of_header, 4, 13 + length_of_header, true)
                .string('Đào tạo')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: 'yellow',
                    },
                });
            ws.cell(3, 14 + length_of_header, 4, 14 + length_of_header, true)
                .string('Thị trường')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: 'yellow',
                    },
                });
            ws.cell(3, 15 + length_of_header, 3, 18 + length_of_header, true)
                .string('Nghỉ hưởng lương')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(4, 15 + length_of_header, 4, 15 + length_of_header, true)
                .string('Nghỉ phép')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(4, 16 + length_of_header, 4, 16 + length_of_header, true)
                .string('Nghỉ lễ')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(4, 17 + length_of_header, 4, 17 + length_of_header, true)
                .string('Nghỉ bù')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(4, 18 + length_of_header, 4, 18 + length_of_header, true)
                .string('Nghỉ khác (kết hôn, tang lễ)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.row(4).setHeight(35);
            ws.cell(3, 19 + length_of_header, 4, 19 + length_of_header, true)
                .string('Tổng công hưởng lương')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80e0ce',
                    },
                });
            ws.cell(3, 20 + length_of_header, 4, 20 + length_of_header, true)
                .string('Tổng công hưởng phụ cấp(ăn trưa, xăng xe)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: 'yellow',
                    },
                });
            ws.cell(2, 21 + length_of_header, 4, 21 + length_of_header, true)
                .string('Công tiêu chuẩn')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#e0d780',
                    },
                });
            ws.cell(2, 22 + length_of_header, 4, 22 + length_of_header, true)
                .string('Tổng công hưởng lương tháng này')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#00a3bf',
                    },
                });
            ws.cell(2, 23 + length_of_header, 4, 23 + length_of_header, true)
                .string('Tổng công hưởng thêm trong tháng')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80cbe0',
                    },
                });

            ws.cell(2, 24 + length_of_header, 4, 24 + length_of_header, true)
                .string('Quên chấm công')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80cbe0',
                    },
                });
            ws.cell(2, 25 + length_of_header, 2, 27 + length_of_header, true)
                .string('Tổng số lần đi muộn về sớm')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80e0ce',
                    },
                });
            ws.cell(3, 25 + length_of_header, 4, 25 + length_of_header, true)
                .string('< 30 phút (trừ 1/4 ngày công)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80e0ce',
                    },
                });
            ws.cell(3, 26 + length_of_header, 4, 26 + length_of_header, true)
                .string('30-60 phút(trừ 1/2 ngày công)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80e0ce',
                    },
                });
            ws.cell(3, 27 + length_of_header, 4, 27 + length_of_header, true)
                .string('>60 phút (không tính công)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#80e0ce',
                    },
                });
            ws.cell(2, 28 + length_of_header, 2, 32 + length_of_header, true)
                .string('Số OT trong tháng')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(3, 28 + length_of_header, 4, 28 + length_of_header, true)
                .string('OT ngày thường (150%)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(3, 29 + length_of_header, 4, 29 + length_of_header, true)
                .string('OT ngày nghỉ (200%)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(3, 30 + length_of_header, 4, 30 + length_of_header, true)
                .string('OT ngày lễ (300%)')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(3, 31 + length_of_header, 4, 31 + length_of_header, true)
                .string('Số giờ làm vượt ca')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(3, 32 + length_of_header, 4, 32 + length_of_header, true)
                .string('Tổng số giờ làm thêm')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(2, 33 + length_of_header, 4, 33 + length_of_header, true)
                .string('Số ngày trực đêm')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c14e',
                    },
                });
            ws.cell(2, 34 + length_of_header, 2, 36 + length_of_header, true)
                .string('THEO DÕI PHÉP')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#a64ec8',
                    },
                });
            ws.cell(3, 34 + length_of_header, 4, 34 + length_of_header, true)
                .string('Tổng ngày phép')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#a64ec8',
                    },
                });
            ws.cell(3, 35 + length_of_header, 4, 35 + length_of_header, true)
                .string('Phép sử dụng trong tháng')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#a64ec8',
                    },
                });
            ws.cell(3, 36 + length_of_header, 4, 36 + length_of_header, true)
                .string('Phép còn')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#a64ec8',
                    },
                });
            ws.cell(2, 37 + length_of_header, 2, 40 + length_of_header, true)
                .string('THEO DÕI NGHỈ BÙ')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            ws.cell(3, 37 + length_of_header, 4, 37 + length_of_header, true)
                .string('Công NB kỳ trước')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            ws.cell(3, 38 + length_of_header, 4, 38 + length_of_header, true)
                .string('Công NB có kỳ này')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            ws.cell(3, 39 + length_of_header, 4, 39 + length_of_header, true)
                .string('Sử dụng NB')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            ws.cell(3, 40 + length_of_header, 4, 40 + length_of_header, true)
                .string('Công NB tồn')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            ws.cell(2, 41 + length_of_header, 4, 41 + length_of_header, true)
                .string('CÔNG ĐỊNH BIÊN')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#c8c44e',
                    },
                });
            ws.cell(2, 42 + length_of_header, 4, 42 + length_of_header, true)
                .string('CÔNG VƯỢT')
                .style({
                    ...styles.bold_center,
                    fill: {
                        ...styles.bold_center.fill,
                        fgColor: '#4ea2c8',
                    },
                });
            const weekdate = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
            let row = 9;
            let position = 5;
            let index = 1;
            for (let i = 0; i < days.length; i++) {
                const nextCol = _days[i].number_of_col;
                const day_off_week = weekdate[moment(days[i], 'DD/MM/YYYY').weekday()];
                ws.cell(3, row, 3, row + (nextCol - 1 > 0 ? (nextCol - 1) : nextCol), true)
                    .string(`${days[i]}`)
                    .style(styles.bold_center);
                ws.cell(4, row, 4, row + (nextCol - 1 > 0 ? (nextCol - 1) : nextCol), true)
                    .string(`${day_off_week}`)
                    .style(styles.bold_center);
                row += nextCol;
            }
            // BODY 
            for (let j = 0; j < list_user.length; j++) {
                let _index = index + j;
                let point = 9;
                let curPoint = 9;
                ws.cell(position, 1).string(`${_index}`).style(styles.body_center);
                ws.cell(position, 2).string(`${list_user[j].user_name}`).style(styles.body_center);
                ws.cell(position, 3).string(`${list_user[j].full_name}`).style(styles.body_center);
                ws.cell(position, 4).string(`${list_user[j].position_name}`).style(styles.body_center);
                ws.cell(position, 5).string(`${list_user[j].entry_date}`).style(styles.body_center);
                ws.cell(position, 6).string(`${list_user[j].store}`).style(styles.body_center);
                ws.cell(position, 7).string(`${list_user[j].department_name}`).style(styles.body_center);
                ws.cell(position, 8).string(`${list_user[j].block_name}`).style(styles.body_center);
                // Working day
                for (let i = 0; i < days.length; i++) {
                    const nextCol = _days[i].number_of_col;
                    const curPoint = point;
                    const shift_in_day = list_user[j].working.filter(item => item.date_in_month == days[i]);

                    if (shift_in_day.length === 0) {
                        for (let k = 0; k < nextCol; k++) {
                            ws.cell(position, point + k).string(`--:--`).style(styles.body_center);
                        }
                        point += nextCol;
                    }

                    shift_in_day.forEach(shift => {
                        if (shift.is_break_shift == 1) { // Ca gãy
                            ws.cell(position, point).string(`${shift.checkin_time || shift.checkin_time_confirm || '--:--'}`).style(styles.body_center);
                            ws.cell(position, point + 1).string(`${getTimeFromDate(shift.checkout_break_time) || '--:--'}`).style(styles.body_center);
                            ws.cell(position, point + 2).string(`${getTimeFromDate(shift.checkin_break_time) || '--:--'}`).style(styles.body_center);
                            ws.cell(position, point + 3).string(`${shift.checkout_time || shift.checkout_time_confirm || '--:--'}`).style(styles.body_center);
                            point += 4
                        } else { // Ca bình thưởng
                            ws.cell(position, point).string(`${shift.checkin_time || shift.checkin_time_confirm || '--:--'}`).style(styles.body_center);
                            ws.cell(position, point + 1).string(`${shift.checkout_time || shift.checkout_time_confirm || '--:--'}`).style(styles.body_center);
                            point += 2
                        }
                        if (shift_in_day.indexOf(shift) === shift_in_day.length - 1) {
                            const temp = point - curPoint
                            const _temp = nextCol - temp;
                            if (temp !== nextCol) {
                                for (let k = 0; k < +_temp; k++) {
                                    ws.cell(position, point + k).string(`--:--`).style(styles.body_center);
                                }
                            }
                            point = curPoint + nextCol;
                        }
                    })
                }
                ws.cell(position, 10 + length_of_header).string(`${list_user[j].actual_working_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 11 + length_of_header).string(`${list_user[j].online_working_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 12 + length_of_header).string(`${list_user[j].support_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 13 + length_of_header).string(`${list_user[j].training_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 14 + length_of_header).string(`${list_user[j].market_research_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 15 + length_of_header).string(`${list_user[j].off_work_total}`)
                    .style(styles.body_center);
                ws.cell(position, 16 + length_of_header).string(`${list_user[j].holiday_total}`)
                    .style(styles.body_center);
                ws.cell(position, 17 + length_of_header).string(`${0}`)
                    .style(styles.body_center);
                ws.cell(position, 18 + length_of_header).string(`${list_user[j].diff_off_work_total}`)
                    .style(styles.body_center);
                ws.cell(position, 19 + length_of_header).string(`${list_user[j].pay_working_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 20 + length_of_header).string(`${list_user[j].allowance_point_total}`)
                    .style(styles.body_center);
                ws.cell(position, 21 + length_of_header).string(`${list_user[j].standard_points_values}`)
                    .style(styles.body_center);
                ws.cell(position, 22 + length_of_header).string(`${list_user[j].pay_working_point_month}`)
                    .style(styles.body_center);
                ws.cell(position, 23 + length_of_header).string(`${list_user[j].plus_working_point_month}`)
                    .style(styles.body_center);
                ws.cell(position, 24 + length_of_header).string(`${list_user[j].miss_time}`)
                    .style(styles.body_center);
                ws.cell(position, 25 + length_of_header).string(`${list_user[j].total_check_in_late_to_30}`)
                    .style(styles.body_center);
                ws.cell(position, 26 + length_of_header).string(`${list_user[j].total_check_in_late_from_30_to_60}`)
                    .style(styles.body_center);
                ws.cell(position, 27 + length_of_header).string(`${list_user[j].total_check_in_late_from_60}`)
                    .style(styles.body_center);
                ws.cell(position, 28 + length_of_header).string(`${list_user[j].normal_time_ot_total}`)
                    .style(styles.body_center);
                ws.cell(position, 29 + length_of_header).string(`${list_user[j].offday_time_ot_total}`)
                    .style(styles.body_center);
                ws.cell(position, 30 + length_of_header).string(`${list_user[j].holiday_time_ot_total}`)
                    .style(styles.body_center);
                ws.cell(position, 31 + length_of_header).string(`${list_user[j].hour_working_over_total}`)
                    .style(styles.body_center);
                ws.cell(position, 32 + length_of_header).string(`${list_user[j].hour_office_over_total}`)
                    .style(styles.body_center);
                ws.cell(position, 33 + length_of_header).string(`0`)
                    .style(styles.body_center);
                ws.cell(position, 34 + length_of_header).string(`${list_user[j].total_time || 0}`) // tổng ngày phép
                    .style(styles.body_center);
                ws.cell(position, 35 + length_of_header).string(`${list_user[j].off_work_use_in_month}`) // phép sử dụng 
                    .style(styles.body_center);
                ws.cell(position, 36 + length_of_header).string(`${list_user[j].total_time - list_user[j].total_time_off || 0}`) // phép còn
                    .style(styles.body_center);
                ws.cell(position, 37 + length_of_header).string(`0`)
                    .style(styles.body_center);
                ws.cell(position, 38 + length_of_header).string(`0`)
                    .style(styles.body_center);
                ws.cell(position, 39 + length_of_header).string(`0`)
                    .style(styles.body_center);
                ws.cell(position, 40 + length_of_header).string(`0`)
                    .style(styles.body_center);
                ws.cell(position, 41 + length_of_header).string(`${list_user[j].boundary_point_total || `0`}`)
                    .style(styles.body_center);
                ws.cell(position, 42 + length_of_header).string(`0`)
                    .style(styles.body_center);
                // point += 1;
                position += 1;
            }
        }

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'scheduleService.getDataExport' });
        return new ServiceResponse(false, error.message || error);
    }
};

const exportExcelMultipleUserTimeKeeping = async (bodyParams = {}) => {
    try {
        let query = apiHelper.getValueFromObject(bodyParams, 'query');
        const users = apiHelper.getValueFromObject(bodyParams, 'users');
        //Kiểm tra xem có phải là export toàn bộ user không
        // ==> nếu là export toàn bột nhân viên
        // ==> tạo 1 file csv lưu thông tin của giữ liệu nhân viên đã xuất

        // Kiem tra xem export mot nhan vien hay nhieu nhan vien
        // Lấy dữ liệu export
        const dataRes = await getDataExportMultipleUserTimeKeeping({
            from_date: query.date_from,
            to_date: query.date_to,
            users: (users || []).map((x) => x.user_name),
            type: 3,
        });

        const user_name_list = (users || []).map((x) => x.user_name);
        if (dataRes.isFailed()) return new ServiceResponse(false, dataRes.getErrors());
        // Khai bao style cho excel
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
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
                    right: {
                        style: 'thin',
                    },
                },
            },
        };
        //Tạo sheet chấm công
        let wb = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });
        let ws = null;
        const { days, _days, list_user, length_of_header } = dataRes.getData();
        const headerLenght = days?.length - 1;
        ws = wb.addWorksheet('Chấm công');
        // let data = _.groupBy(list_user, 'business_name');
        //HEADER
        // Common css
        ws.column(4).freeze();
        ws.column(3).setWidth(25);
        ws.column(4).setWidth(25);
        ws.row(3).setHeight(35);
        ws.row(4).setHeight(50);
        ws.cell(2, 1, 4, 1, true)
            .string('STT')
            .style(styles.bold_center);
        ws.cell(2, 2, 4, 2, true)
            .string('MNV')
            .style(styles.bold_center);
        ws.cell(2, 3, 4, 3, true)
            .string('HỌ VÀ TÊN')
            .style(styles.bold_center);
        ws.cell(2, 4, 4, 4, true)
            .string('CHỨC VỤ')
            .style(styles.bold_center);
        ws.cell(2, 5, 4, 5, true)
            .string('NGÀY VÀO LÀM VIỆC')
            .style(styles.bold_center);
        ws.cell(2, 6, 4, 6, true)
            .string('CỬA HÀNG')
            .style(styles.bold_center);
        ws.cell(2, 7, 4, 7, true)
            .string('Phòng ban')
            .style(styles.bold_center);
        ws.cell(2, 8, 4, 8, true)
            .string('Khối')
            .style(styles.bold_center);
        ws.cell(2, 9, 2, 9 + headerLenght, true)
            .string('Chấm công hàng ngày')
            .style(styles.bold_center);
        ws.cell(2, 10 + headerLenght, 2, 20 + headerLenght, true)
            .string('KẾT QUẢ CÔNG')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(3, 10 + headerLenght, 4, 10 + headerLenght, true)
            .string('Công làm việc thực tế')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(3, 11 + headerLenght, 4, 11 + headerLenght, true)
            .string('Công Online')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(3, 12 + headerLenght, 4, 12 + headerLenght, true)
            .string('Hỗ trợ')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: 'yellow',
                },
            });
        ws.cell(3, 13 + headerLenght, 4, 13 + headerLenght, true)
            .string('Đào tạo')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: 'yellow',
                },
            });
        ws.cell(3, 14 + headerLenght, 4, 14 + headerLenght, true)
            .string('Thị trường')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: 'yellow',
                },
            });
        ws.cell(3, 15 + headerLenght, 3, 18 + headerLenght, true)
            .string('Nghỉ hưởng lương')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(4, 15 + headerLenght, 4, 15 + headerLenght, true)
            .string('Nghỉ phép')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(4, 16 + headerLenght, 4, 16 + headerLenght, true)
            .string('Nghỉ lễ')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(4, 17 + headerLenght, 4, 17 + headerLenght, true)
            .string('Nghỉ bù')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(4, 18 + headerLenght, 4, 18 + headerLenght, true)
            .string('Nghỉ khác (kết hôn, tang lễ)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.row(4).setHeight(35);
        ws.cell(3, 19 + headerLenght, 4, 19 + headerLenght, true)
            .string('Tổng công hưởng lương')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80e0ce',
                },
            });
        ws.cell(3, 20 + headerLenght, 4, 20 + headerLenght, true)
            .string('Tổng công hưởng phụ cấp(ăn trưa, xăng xe)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: 'yellow',
                },
            });
        ws.cell(2, 21 + headerLenght, 4, 21 + headerLenght, true)
            .string('Công tiêu chuẩn')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#e0d780',
                },
            });
        ws.cell(2, 22 + headerLenght, 4, 22 + headerLenght, true)
            .string('Tổng công hưởng lương tháng này')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#00a3bf',
                },
            });
        ws.cell(2, 23 + headerLenght, 4, 23 + headerLenght, true)
            .string('Tổng công hưởng thêm trong tháng')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80cbe0',
                },
            });
        ws.cell(2, 24 + headerLenght, 4, 24 + headerLenght, true)
            .string('Quên chấm công')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80cbe0',
                },
            });
        ws.cell(2, 25 + headerLenght, 2, 27 + headerLenght, true)
            .string('Tổng số lần đi muộn về sớm')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80e0ce',
                },
            });
        ws.cell(3, 25 + headerLenght, 4, 25 + headerLenght, true)
            .string('< 30 phút (trừ 1/4 ngày công)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80e0ce',
                },
            });
        ws.cell(3, 26 + headerLenght, 4, 26 + headerLenght, true)
            .string('30-60 phút(trừ 1/2 ngày công)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80e0ce',
                },
            });
        ws.cell(3, 27 + headerLenght, 4, 27 + headerLenght, true)
            .string('>60 phút (không tính công)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#80e0ce',
                },
            });
        ws.cell(2, 28 + headerLenght, 2, 32 + headerLenght, true)
            .string('Số OT trong tháng')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(3, 28 + headerLenght, 4, 28 + headerLenght, true)
            .string('OT ngày thường (150%)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(3, 29 + headerLenght, 4, 29 + headerLenght, true)
            .string('OT ngày nghỉ (200%)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(3, 30 + headerLenght, 4, 30 + headerLenght, true)
            .string('OT ngày lễ (300%)')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(3, 31 + headerLenght, 4, 31 + headerLenght, true)
            .string('Số giờ làm vượt ca')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(3, 32 + headerLenght, 4, 32 + headerLenght, true)
            .string('Tổng số giờ làm thêm')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(2, 33 + headerLenght, 4, 33 + headerLenght, true)
            .string('Số ngày trực đêm')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c14e',
                },
            });
        ws.cell(2, 34 + headerLenght, 2, 36 + headerLenght, true)
            .string('THEO DÕI PHÉP')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#a64ec8',
                },
            });
        ws.cell(3, 34 + headerLenght, 4, 34 + headerLenght, true)
            .string('Tổng ngày phép')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#a64ec8',
                },
            });
        ws.cell(3, 35 + headerLenght, 4, 35 + headerLenght, true)
            .string('Phép sử dụng trong tháng')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#a64ec8',
                },
            });
        ws.cell(3, 36 + headerLenght, 4, 36 + headerLenght, true)
            .string('Phép còn')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#a64ec8',
                },
            });
        ws.cell(2, 37 + headerLenght, 2, 40 + headerLenght, true)
            .string('THEO DÕI NGHỈ BÙ')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        ws.cell(3, 37 + headerLenght, 4, 37 + headerLenght, true)
            .string('Công NB kỳ trước')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        ws.cell(3, 38 + headerLenght, 4, 38 + headerLenght, true)
            .string('Công NB có kỳ này')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        ws.cell(3, 39 + headerLenght, 4, 39 + headerLenght, true)
            .string('Sử dụng NB')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        ws.cell(3, 40 + headerLenght, 4, 40 + headerLenght, true)
            .string('Công NB tồn')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        ws.cell(2, 41 + headerLenght, 4, 41 + headerLenght, true)
            .string('CÔNG ĐỊNH BIÊN')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#c8c44e',
                },
            });
        ws.cell(2, 42 + headerLenght, 4, 42 + headerLenght, true)
            .string('CÔNG VƯỢT')
            .style({
                ...styles.bold_center,
                fill: {
                    ...styles.bold_center.fill,
                    fgColor: '#4ea2c8',
                },
            });
        const weekdate = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
        let row = 9;
        let position = 5;
        let index = 1;
        for (let i = 0; i < days.length; i++) {
            const nextCol = 1;
            const day_off_week = weekdate[moment(days[i], 'DD/MM/YYYY').weekday()];
            ws.cell(3, row, 3, row, true)
                .string(`${days[i]}`)
                .style(styles.bold_center);
            ws.cell(4, row, 4, row, true)
                .string(`${day_off_week}`)
                .style(styles.bold_center);
            row += nextCol;
        }
        //BODY 
        for (let j = 0; j < list_user.length; j++) {
            let _index = index + j;
            let point = 9;
            let curPoint = 9;
            ws.cell(position, 1).string(`${_index}`).style(styles.body_center);
            ws.cell(position, 2).string(`${list_user[j].user_name}`).style(styles.body_center);
            ws.cell(position, 3).string(`${list_user[j].full_name}`).style(styles.body_center);
            ws.cell(position, 4).string(`${list_user[j].position_name}`).style(styles.body_center);
            ws.cell(position, 5).string(`${list_user[j].entry_date}`).style(styles.body_center);
            ws.cell(position, 6).string(`${list_user[j].store}`).style(styles.body_center);
            ws.cell(position, 7).string(`${list_user[j].department_name}`).style(styles.body_center);
            ws.cell(position, 8).string(`${list_user[j].block_name}`).style(styles.body_center);
            // Working day
            var actualWorkingCount = 0;
            for (let i = 0; i < days.length; i++) {
                const nextCol = _days[i].number_of_col;
                const curPoint = point;
                const shift_in_day = list_user[j].working.filter(item => item.date_in_month == days[i]);

                var countWorkInDay = 0;
                if (shift_in_day && shift_in_day.length > 0) {
                    shift_in_day.forEach(item => {
                        countWorkInDay += item?.work_time;
                        actualWorkingCount += item?.work_time;
                    });
                }
                var txtCountWorkInDay = countWorkInDay + "";
                if (txtCountWorkInDay.length == 1) {
                    txtCountWorkInDay = txtCountWorkInDay + ',0';
                }
                ws.cell(position, point).string(`${countWorkInDay > 0 ? txtCountWorkInDay.replace(".", ",") : 0}`).style(styles.body_center);

                point += 1
            }
            ws.cell(position, 10 + headerLenght).string(`${list_user[j].actual_working_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 11 + headerLenght).string(`${list_user[j].online_working_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 12 + headerLenght).string(`${list_user[j].support_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 13 + headerLenght).string(`${list_user[j].training_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 14 + headerLenght).string(`${list_user[j].market_research_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 15 + headerLenght).string(`${list_user[j].off_work_total}`)
                .style(styles.body_center);
            ws.cell(position, 16 + headerLenght).string(`${list_user[j].holiday_total}`)
                .style(styles.body_center);
            ws.cell(position, 17 + headerLenght).string(`${0}`)
                .style(styles.body_center);
            ws.cell(position, 18 + headerLenght).string(`${list_user[j].diff_off_work_total}`)
                .style(styles.body_center);
            ws.cell(position, 19 + headerLenght).string(`${list_user[j].pay_working_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 20 + headerLenght).string(`${list_user[j].allowance_point_total}`)
                .style(styles.body_center);
            ws.cell(position, 21 + headerLenght).string(`${list_user[j].standard_points_values}`)
                .style(styles.body_center);
            ws.cell(position, 22 + headerLenght).string(`${list_user[j].pay_working_point_month}`)
                .style(styles.body_center);
            ws.cell(position, 23 + headerLenght).string(`${list_user[j].plus_working_point_month}`)
                .style(styles.body_center);
            ws.cell(position, 24 + headerLenght).string(`${list_user[j].miss_time}`)
                .style(styles.body_center);
            ws.cell(position, 25 + headerLenght).string(`${list_user[j].total_check_in_late_to_30}`)
                .style(styles.body_center);
            ws.cell(position, 26 + headerLenght).string(`${list_user[j].total_check_in_late_from_30_to_60}`)
                .style(styles.body_center);
            ws.cell(position, 27 + headerLenght).string(`${list_user[j].total_check_in_late_from_60}`)
                .style(styles.body_center);
            ws.cell(position, 28 + headerLenght).string(`${list_user[j].normal_time_ot_total}`)
                .style(styles.body_center);
            ws.cell(position, 29 + headerLenght).string(`${list_user[j].offday_time_ot_total}`)
                .style(styles.body_center);
            ws.cell(position, 30 + headerLenght).string(`${list_user[j].holiday_time_ot_total}`)
                .style(styles.body_center);
            ws.cell(position, 31 + headerLenght).string(`${list_user[j].hour_working_over_total}`)
                .style(styles.body_center);
            ws.cell(position, 32 + headerLenght).string(`${list_user[j].hour_office_over_total}`)
                .style(styles.body_center);
            ws.cell(position, 33 + headerLenght).string(`0`)
                .style(styles.body_center);
            ws.cell(position, 34 + headerLenght).string(`${list_user[j].total_time || 0}`) // tổng ngày phép
                .style(styles.body_center);
            ws.cell(position, 35 + headerLenght).string(`${list_user[j].off_work_use_in_month}`) // phép sử dụng 
                .style(styles.body_center);
            ws.cell(position, 36 + headerLenght).string(`${list_user[j].total_time - list_user[j].total_time_off || 0}`) // phép còn
                .style(styles.body_center);
            ws.cell(position, 37 + headerLenght).string(`0`)
                .style(styles.body_center);
            ws.cell(position, 38 + headerLenght).string(`0`)
                .style(styles.body_center);
            ws.cell(position, 39 + headerLenght).string(`0`)
                .style(styles.body_center);
            ws.cell(position, 40 + headerLenght).string(`0`)
                .style(styles.body_center);
            ws.cell(position, 41 + headerLenght).string(`${list_user[j].boundary_point_total || `0`}`)
                .style(styles.body_center);
            ws.cell(position, 42 + headerLenght).string(`0`)
                .style(styles.body_center);
            // point += 1;
            position += 1;
        }
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'scheduleService.getDataExport' });
        return new ServiceResponse(false, error.message || error);
    }
};

const getListShiftQC = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const time_keeping = apiHelper.getValueFromObject(queryParams, 'time_keeping')
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SHIFTIDS', apiHelper.getValueFromObject(queryParams, 'shift_ids'))
            .input('TIMEKEEPING', moment(time_keeping, 'DD/MM/YYYY').format('YYYY-MM-DD'))
            .execute('HR_IMAGE_QC_GetListShiftQC_AdminWeb_New');
        const dataRecord = data.recordset;

        return new ServiceResponse(true, 'Lấy danh sách ca của qc thành công', {
            list: timeKeepingClass.listShiftQC(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingService.getListShiftQC' });
        return new ServiceResponse(true, '', {});
    }
};

const getListBrokenShift = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SHIFTDATE', apiHelper.getValueFromObject(queryParams, 'shift_date'))
            .input('SHIFTIDS', apiHelper.getValueFromObject(queryParams, 'shift_ids'))
            .execute('HR_IMAGE_GetListBrokenShift_AdminWeb');
        const dataRecord = data.recordset;

        return new ServiceResponse(true, 'Lấy danh sách ca của ca gãy thành công', {
            list: timeKeepingClass.listBrokenShift(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingService.getListBrokenShift' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListUser,
    getListOption,
    createOrUpdateSchedule,
    createOrUpdateTimeKeeping,
    deleteSchedule,
    createOrUpdateTimeKeepingList,
    checkPerMission,
    getListTimeKeepingByUser,
    exportExcel,
    exportExcelMultipleUser,
    getListShiftQC,
    getListBrokenShift,
    exportExcelMultipleUserTimeKeeping
};