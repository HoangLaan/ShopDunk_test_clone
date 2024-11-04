const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    user_id: '{{#? USERID}}',
    user_name: '{{#? USERNAME}}',
    user_fullname: '{{#? FULLNAME}}',
    user_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    url_checkin: [
        {
            '{{#if URLPICTURECHECKIN}}': `${config.domain_cdn}{{URLPICTURECHECKIN}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    url_checkout: [
        {
            '{{#if URLPICTURECHECKOUT}}': `${config.domain_cdn}{{URLPICTURECHECKOUT}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    shift_id: '{{#? SHIFTID}}',
    shift_name: '{{#? SHIFTNAME}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    minuteCheckin_late: '{{#? MINUTECHECKINLATE}}',
    number_of_workday: '{{#? NUMBEROFWORKDAY}}',
    schedule_id: '{{#? SCHEDULEID}}',
    shift_date: '{{#? SHIFTDATE}}',
    user_confirm: '{{#? USERCONFIRM}}',
    time_start: '{{#? TIMESTART}}',
    time_end: '{{#? TIMEEND}}',
    confirm_time_start: '{{#? CONFIRMTIMESTART}}',
    confirm_time_end: '{{#? CONFIRMTIMEEND}}',
    time_keeping_id: '{{#? TIMEKEEPINGID}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    fullName: '{{#? USERFULLNAME}}',
    total_time: '{{#? TOTALTIME}}',
    total_time_confirm: '{{#? TOTALTIMECONFIRM}}',
    position_name: '{{#? POSITIONNAME}}',
    is_confirm: '{{#? ISCONFIRM}}',
    time_keeping: '{{#? TIMEKEEPING}}',
    time_keeping_time_start: '{{#? TIMEKEEPINGTIMESTART}}',
    time_keeping_time_end: '{{#? TIMEKEEPINGTIMEEND}}',
    is_lock_confirm: '{{ ISLOCKCONFRIM ? 1 : 0}}',
    explanation: '{{#? EXPLANATION}}',
    is_check_store: '{{ ISCHECKSTORE ? 1 : 0}}',
    is_break_shift: '{{ ISBREAKSHIFT ? 1 : 0}}',
    checkin_break_time: '{{#? CHECKINBREAKTIME}}',
    checkout_break_time: '{{#? CHECKOUTBREAKTIME}}',
    holiday_name: '{{#? HOLIDAYNAME}}',
    //Holiday
    holiday_name: '{{#? HOLIDAYNAME}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    //Off work
    content_off_work: '{{#? CONTENTOFFWORK}}',
    date_off_to: '{{#? DATEOFFTO}}',
    date_off_from: '{{#? DATEOFFFROM}}',
    //Work shedule
    work_schedule_id: '{{#? WORKSCHEDULEID}}',
    work_schedule_name: '{{#? WORKSCHEDULENAME}}',
    start_time: '{{#? STARTTIME}}',
    end_time: '{{#? ENDTIME}}',
};
let transform = new Transform(template);

const listUser = (data = []) => {
    return transform.transform(data, ['user_id', 'user_name', 'user_fullname', 'user_picture_url', 'department_name']);
};
const department = (data = []) => {
    return transform.transform(data, ['department_id', 'user_name', 'position_name', 'department_name']);
};
const listShift = (data = []) => {
    return transform.transform(data, ['shift_id', 'shift_name', 'time_start', 'time_end']);
};
const listStore = (data = []) => {
    return transform.transform(data, ['store_id', 'store_name']);
};
const listDepartment = (data = []) => {
    return transform.transform(data, ['department_id', 'department_name']);
};
const listBusiness = (data = []) => {
    return transform.transform(data, ['business_id', 'business_name']);
};
const listSchedule = (data = []) => {
    return transform.transform(data, [
        'store_id',
        'shift_id',
        'shift_date',
        'schedule_id',
        'user_fullname',
        'user_name',
        'store_name',
        'number_of_workday',
        'shift_name',
        'is_confirm',
        'time_start',
        'time_end',
        'is_lock_confirm',
        'explanation',
        'is_check_store',
        'is_break_shift',
    ]);
};
const timekeepingDetail = (data = []) => {
    return transform.transform(data, [
        'time_keeping_time_end',
        'time_keeping_time_start',
        'user_confirm',
        'time_keeping_id',
        'fullName',
        'total_time',
        'confirm_time_start',
        'confirm_time_end',
        'total_time_confirm',
        'url_checkout',
        'url_checkin',
        'user_name',
        'shift_id',
        'time_keeping',
        'explanation',
        'checkin_break_time',
        'checkout_break_time',
    ]);
};

const timeKeepingExcel = (timekeeping = []) => {
    const template = {
        is_time_keeping: '{{#? ISTIMEKEEPING}}',
        user_name: '{{#? USERNAME}}',
        entry_date: '{{#? ENTRYDATE}}',
        full_name: '{{#? FULLNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        position_name: '{{#? POSITIONNAME}}',
        timekeeping_date: '{{#? TIMEKEEPINGDATE}}',
        time_start: '{{#? TIMESTART}}',
        time_end: '{{#? TIMEEND}}',
        checkin_time: '{{#? CHECKINTIME}}',
        checkout_time: '{{#? CHECKOUTTIME}}',
        checkin_time_confirm: '{{#? CHECKINTIMECONFIRM}}',
        checkout_time_confirm: '{{#? CHECKOUTTIMECONFIRM}}',
        confirm_hour_start: '{{CONFIRMHOURSTART ? CONFIRMHOURSTART : 0}}',
        confirm_minute_start: '{{CONFIRMMINUTESTART ? CONFIRMMINUTESTART : 0}}',
        confirm_hour_end: '{{CONFIRMHOUREND ? CONFIRMHOUREND : 0}}',
        confirm_minute_end: '{{CONFIRMMINUTEEND ? CONFIRMMINUTEEND : 0}}',
        checkin_late: '{{#? CHECKINLATE}}',
        checkout_early: '{{#? CHECKOUTEARLY}}',
        is_over_time: '{{#? ISOVERTIME}}',
        // SHIFT
        shift_minute_checkin_late: '{{SMINUTECHECKINLATE ? SMINUTECHECKINLATE : 0}}',
        shift_minute_checkout_early: '{{SMINUTECHECKOUTEARLY ? SMINUTECHECKOUTEARLY : 0}}',
        shift_shift_time: '{{#? SSHIFTIME}}',
        shift_hour_checkin: '{{SHOURCHECKIN ? SHOURCHECKIN : 0}}',
        shift_minute_checkin: '{{SMINUTECHECKIN ? SMINUTECHECKIN : 0}}',
        shift_hour_checkout: '{{SHOURCHECKOUT ? SHOURCHECKOUT : 0}}',
        shift_minute_checkout: '{{SMINUTECHECKOUT ? SMINUTECHECKOUT : 0}}',
        shift_hour_break_start: '{{SHOURBREAKSTART ? SHOURBREAKSTART : 0}}',
        shift_minute_break_start: '{{SMINUTEBREAKSTART ? SMINUTEBREAKSTART : 0}}',
        shift_hour_break_end: '{{SHOURBREAKEND ? SHOURBREAKEND : 0}}',
        shift_minute_break_end: '{{SMINUTEBREAKEND ? SMINUTEBREAKEND : 0}}',
        date_in_month: '{{#? DATEINMONTH}}',
        business_name: '{{#? BUSINESSNAME}}',
        schedule_id: '{{#? SCHEDULEID}}',
        shift_number_of_work_day: '{{SNUMBEROFWORKDAY ? SNUMBEROFWORKDAY : 0}}',
        // SHIFT OVER TIME
        shift_is_over_time: '{{#? SISOVERTIME}}',
        // HOLIDATE
        is_holiday: '{{#? ISHOLIDAY}}',
        // OFFWORK
        offwork: '{{#? OFFWORK}}',
        is_working_day: '{{#? ISWORKINGDAY}}',
        is_online: '{{#? ISONLINE}}',

        stime_start: '{{#? STIMESTART}}',
        stime_end: '{{#? STIMEEND}}',

        is_check_store: '{{#? ISCHECKSTORE}}',
        is_break_shift: '{{#? ISBREAKSHIFT}}',
        is_online: '{{#? ISONLINE}}',
        is_support: '{{#? ISSUPPORT}}',
        is_training: '{{#? ISTRAINING}}',
        is_market_research: '{{#? ISMARKETRESEARCH}}',
        total_time_confirm: '{{#? TOTALTIMECONFIRM}}',
        standard_points_values: '{{#? STANDARDPOINTSVALUES}}', // công tiêu chuẩn
        off_work: '{{OFFWORK == 0 ? OFFWORK : OFFWORK}}',
        checkout_break_time: '{{#? CHECKOUTBREAKTIME}}',
        checkin_break_time: '{{#? CHECKINBREAKTIME}}',
        is_office: '{{#? ISOFFICE}}',
        time_can_off: '{{#? TIMECANOFF}}',
        total_time_off: '{{#? TOTALTIMEOFF}}',
        total_time: '{{#? TOTALTIME}}',
        block_name: '{{#? BLOCKNAME}}',
        store: '{{#? STORE}}',
        miss_time: '{{#? MISS_TIME ? MISS_TIME : 0}}',
        work_time: '{{WORKTIME ? WORKTIME : 0}}'
    };
    let transform = new Transform(template);
    return transform.transform(timekeeping, [
        'total_time',
        'block_name',
        'time_can_off',
        'total_time_off',
        'is_office',
        'checkout_break_time',
        'checkin_break_time',
        'is_time_keeping',
        'user_name',
        'entry_date',
        'full_name',
        'department_name',
        'timekeeping_date',
        'time_start',
        'time_end',
        'checkin_time',
        'checkout_time',
        'checkin_time_confirm',
        'checkout_time_confirm',
        'confirm_hour_start',
        'confirm_minute_start',
        'confirm_hour_end',
        'confirm_minute_end',
        'shift_minute_checkin_late',
        'shift_minute_checkout_early',
        'shift_shift_time',
        'shift_hour_checkin',
        'shift_minute_checkin',
        'shift_hour_checkout',
        'shift_minute_checkout',
        'shift_hour_break_start',
        'shift_minute_break_start',
        'shift_hour_break_end',
        'shift_minute_break_end',
        'date_in_month',
        'business_name',
        'schedule_id',
        'shift_number_of_work_day',
        'checkin_late',
        'checkout_early',
        'shift_is_over_time',
        'shift_shift_over_time',
        'shift_hour_start_over_time',
        'shift_minus_start_over_time',
        'shift_hour_end_over_time',
        'shift_minus_end_over_time',
        'shift_number_of_work_day_over_time',
        'shift_over_time_id',
        'is_over_time',
        'is_holiday',
        'offwork',
        'is_working_day',
        'is_online',
        'position_name',
        'stime_start',
        'stime_end',
        'standard_points_values',
        'is_check_store',
        'is_break_shift',
        'is_support',
        'is_training',
        'is_market_research',
        'total_time_confirm',
        'off_work',
        'store',
        'miss_time',
        'work_time'
    ]);
};

const listHoliday = (data = []) => transform.transform(data, ['holiday_name', 'start_date', 'end_date']);

const listOffWork = (data = []) =>
    transform.transform(data, ['user_name', 'date_off_to', 'date_off_from', 'content_off_work']);

const listWorkSchedule = (data = []) =>
    transform.transform(data, ['work_schedule_id', 'work_schedule_name', 'user_name', 'start_time', 'end_time']);

const listShiftQC = (data = []) => {
    const template = {
        time_start: '{{#? TIMESTART}}',
        time_end: '{{#? TIMEEND}}',
        img_checkin: '{{#? IMAGECHECKIN}}',
        img_checkout: '{{#? IMAGECHECKOUT}}',
        store_name: '{{#? STORENAME}}',
        district_name: '{{#? DISTRICTNAME}}',
        ward_name: '{{#? WARDNAME}}',
        area_name: '{{#? AREANAME}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const listBrokenShift = (data = []) => {
    const template = {
        time_start: '{{#? TIMESTART}}',
        time_end: '{{#? TIMEEND}}',
        check_in_break_time: '{{#? CHECKINBREAKTIME}}',
        check_out_break_time: '{{#? CHECKOUTBREAKTIME}}',
        img_checkin: [
            {
                '{{#if URLPICTURECHECKIN}}': `${config.domain_cdn}{{URLPICTURECHECKIN}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        img_checkout: [
            {
                '{{#if URLPICTURECHECKOUT}}': `${config.domain_cdn}{{URLPICTURECHECKOUT}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        img_checkin_break_time: [
            {
                '{{#if URLCHECKINBREAKTIME}}': `${config.domain_cdn}{{URLCHECKINBREAKTIME}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        img_checkout_break_time: [
            {
                '{{#if URLCHECKOUTBREAKTIME}}': `${config.domain_cdn}{{URLCHECKOUTBREAKTIME}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        store_name: '{{#? STORENAME}}',
        district_name: '{{#? DISTRICTNAME}}',
        ward_name: '{{#? WARDNAME}}',
        area_name: '{{#? AREANAME}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    listUser,
    listStore,
    listSchedule,
    listShift,
    timekeepingDetail,
    listDepartment,
    listBusiness,
    department,
    timeKeepingExcel,
    listHoliday,
    listOffWork,
    listWorkSchedule,
    listShiftQC,
    listBrokenShift,
};