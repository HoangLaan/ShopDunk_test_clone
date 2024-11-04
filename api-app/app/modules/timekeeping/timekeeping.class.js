const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    // shiftInfo
    store_name: '{{#? STORENAME}}',
    shift_date: '{{#? SHIFTDATE}}',
    shift_time: '{{#? SHIFTTIME}}',
    status_check_in: '{{STATUSCHECKIN ? STATUSCHECKIN : 0 }}',
    start_time: '{{#? STARTTIME}}',
    end_time: '{{#? ENDTIME}}',
    location_x: '{{#? LOCATIONX}}',
    location_y: '{{#? LOCATIONY}}',
    store_id: '{{#? STOREID}}',
    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',

    // timekeepingList
    timekeeping_date_text: '{{#? TIMEKEEPINGDATETEXT}}',
    timekeeping_date: '{{#? TIMEKEEPINGDATE}}',
    shift_name: '{{#? SHIFTNAME}}',
    number_of_work_day: '{{#? NUMBEROFWORKDAY}}',
    number_of_work_day_over_time: '{{#? NUMBEROFWORKDAYOVERTIME}}',
    time_start: '{{#? TIMESTART}}',
    time_end: '{{#? TIMEEND}}',
    total_time: '{{TOTALTIME ? TOTALTIME : 0 }}',
    confirm_time_start: '{{#? CONFIRMTIMESTART}}',
    confirm_time_end: '{{#? CONFIRMTIMEEND}}',
    confirm_total_time: '{{CONFIRMTOTALTIME ? CONFIRMTOTALTIME : 0 }}',
    minute_check_in_late: '{{#? MINUTECHECKINLATE}}',
    minute_check_out_early: '{{#? MINUTECHECKOUTEARLY}}',
    check_in_picture_url: [
        {
            '{{#if URLPICTURECHECKIN}}': `${config.domain_cdn}{{URLPICTURECHECKIN}}`,
        },
        {
            '{{#else}}': '',
        },
    ],
    check_out_picture_url: [
        {
            '{{#if URLPICTURECHECKOUT}}': `${config.domain_cdn}{{URLPICTURECHECKOUT}}`,
        },
        {
            '{{#else}}': '',
        },
    ],
    is_confirm: '{{ISCONFIRM ? ISCONFIRM : 0}}',
    user_confirm: '{{#? USERCONFIRM}}',
    user_confirm_picture_url: [
        {
            '{{#if USERCONFIRMPICTUREURL}}': `${config.domain_cdn}{{USERCONFIRMPICTUREURL}}`,
        },
        {
            '{{#else}}': '',
        },
    ],

    total_work: '{{TOTALWORK ? TOTALWORK : 0 }}',
    total_late: '{{TOTALCHECKINLATE ? TOTALCHECKINLATE : 0 }}',
    total_early: '{{TOTALCHECKOUTEARLY ? TOTALCHECKOUTEARLY : 0 }}',
    total_overtime: '{{TOTALOVERTIME ? TOTALOVERTIME : 0 }}',
    schedule_id: '{{#? SCHEDULEID}}',
    is_break_shift: '{{!!ISBREAKSHIFT}}',
    check_out_break_time_picture_url: `${config.domain_cdn}{{URLCHECKOUTBREAKTIME ? URLCHECKOUTBREAKTIME : '' }}`,
    check_in_break_time_picture_url: `${config.domain_cdn}{{URLCHECKINBREAKTIME ? URLCHECKINBREAKTIME : '' }}`,
    time_end_break: '{{CHECKOUTBREAKTIME}}',
    time_start_break: '{{CHECKINBREAKTIME}}',
    shift_time_start: '{{#? SHIFTTIMESTART}}',
    shift_time_end: '{{#? SHIFTTIMEEND}}',
    shift_time_break_start: '{{#? SHIFTTIMEBREAKSTART}}',
    shift_time_break_end: '{{#? SHIFTTIMEBREAKEND}}',
    minute_check_out_break_early: '{{#? MINUTECHECKOUTBREAKEARLY}}',
    minute_check_in_break_late: '{{#? MINUTECHECKINBREAKLATE}}',
};
let transform = new Transform(template);

const shiftInfo = (data = []) => {
    const shiftInfoTemplate = {
        shift_id: '{{#? SHIFTID}}',
        shift_name: '{{#? SHIFTNAME}}',
        is_check_store: '{{ISCHECKSTORE ? !!ISCHECKSTORE : false}}',
        is_break_shift: '{{ISBREAKSHIFT ? !!ISBREAKSHIFT : false}}',
        status_check_in: '{{STATUSCHECKIN ? STATUSCHECKIN : 0 }}',
        start_time: '{{#? STARTTIME}}',
        end_time: '{{#? ENDTIME}}',
        schedule_id: '{{#? SCHEDULEID}}',
        checkin_time: '{{#? CHECKINTIME}}',
        checkout_break_time: '{{#? CHECKOUTBREAKTIME}}',
        checkin_break_time: '{{#? CHECKINBREAKTIME}}',
        checkout_time: '{{#? CHECKOUTTIME}}',
        start_break_time: '{{#? STARTBREAKTIME}}',
        end_break_time: '{{#? ENDBREAKTIME}}',
        store_id: '{{#? STOREID}}',
        time_in: '{{#? TIMEIN}}',
        time_out: '{{#? TIMEOUT}}',
    };

    return new Transform(shiftInfoTemplate).transform(data, [
        'shift_id',
        'shift_name',
        'is_check_store',
        'is_break_shift',
        'status_check_in',
        'start_time',
        'end_time',
        'location_x',
        'location_y',
        'store_id',
        'company_id',
        'business_id',
        'schedule_id',
        'checkin_time',
        'checkout_break_time',
        'checkin_break_time',
        'checkout_time',
        'start_break_time',
        'end_break_time',
        'time_in',
        'time_out'
    ]);
};

const timekeepingStatitics = data => {
    return transform.transform(data, ['total_work', 'total_late', 'total_early', 'total_overtime']);
};

const timekeepingList = (list = []) => {
    return transform.transform(list, [
        'timekeeping_date_text',
        'timekeeping_date',

        'shift_name',
        'shift_time',
        'number_of_work_day',
        'number_of_work_day_over_time',

        'time_start',
        'time_end',
        'total_time',

        'confirm_time_start',
        'confirm_time_end',
        'confirm_total_time',

        'minute_check_in_late',
        'minute_check_out_early',

        'check_in_picture_url',
        'check_out_picture_url',

        'is_confirm',
        'user_confirm',
        'user_confirm_picture_url',
        'schedule_id',

        'is_break_shift',
        'check_out_break_time_picture_url',
        'check_in_break_time_picture_url',

        'time_end_break',
        'time_start_break',
        'shift_time_start',
        'shift_time_end',
        'shift_time_break_start',
        'shift_time_break_end',
        'minute_check_out_break_early',
        'minute_check_in_break_late',
    ]);
};

module.exports = {
    shiftInfo,
    timekeepingStatitics,
    timekeepingList,
};
