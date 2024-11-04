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
    date: '{{#? DATE}}',
    shift_id: '{{#? SHIFTID}}',
    shift_name: '{{#? SHIFTNAME}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    address: '{{#? ADDRESS}}',
    schedule_id: '{{#? SCHEDULEID}}',
    shift_date: '{{#? SHIFTDATE}}',
    user_confirm: '{{#? USERCONFIRM}}',
    time_start: '{{#? TIMESTART}}',
    time_end: '{{#? TIMEEND}}',
    time_keeping_id: '{{#? TIMEKEEPINGID}}',
    is_time_keeping: '{{#? ISTIMEKEEPING}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    fullName: '{{#? USERFULLNAME}}',
    total_time: '{{#? TOTALTIME}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    Monday: '{{#? ISAPPLYMONDAY}}',
    Tuesday: '{{#? ISAPPLYTUESDAY}}',
    Wednesday: '{{#? ISAPPLYWEDNESDAY}}',
    Thursday: '{{#? ISAPPLYTHURSDAY}}',
    Friday: '{{#? ISAPPLYFRIDAY}}',
    Saturday: '{{#? ISAPPLYSATURDAY}}',
    Sunday: '{{#? ISAPPLYSUNDAY}}',
    date_create: '{{ DATETIMECREATE}}',
    min_date: '{{#? MINDATE}}',
    max_date: '{{#? MAXDATE}}',
    is_review: '{{ISREVIEW!==null?ISREVIEW:3}}',
    have_permission: '{{#? HAVEPERMISSION}}',
    is_overtime: '{{ISOVERTIME ? 1 : 0}}',
    business_id: '{{#? BUSINESSID}}',
    range: '{{#? ISDATERANGE }}',
    week_in_date: '{{#? WEEKINMONTH }}',
    shift_date_month: '{{#? SHIFTDATE_MONTH }}',
    status_check: '{{#? STATUSCHECK}}',
    disabled: '{{#? DISABLED}}',
    is_can_edit: '{{ISCANEDIT ? ISCANEDIT : 0}}',
    user_review_list: '{{#? USERREVIEWLIST}}',
    is_review_all: '{{ISREVIEWALL !== null ? ISREVIEWALL : 3}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    erp_code: '{{#? MAERP}}',
    hour_start: '{{#? HOURSTART}}',
    hour_end: '{{#? HOUREND}}',
    time_keeping: '{{#? TIMEKEEPING}}',
};
let transform = new Transform(template);

const listUser = (data = []) => {
    return transform.transform(data, ['user_id', 'user_name', 'user_fullname', 'user_picture_url', 'department_name']);
};
const listShift = (data = []) => {
    return transform.transform(data, ['shift_id', 'shift_name', 'time_start', 'time_end', 'address']);
};
const listShiftOption = (data = []) => {
    return transform.transform(data, ['shift_id', 'shift_name', 'is_overtime']);
};
const listStore = (data = []) => {
    return transform.transform(data, ['store_id', 'store_name', 'business_id']);
};
const listCompany = (data = []) => {
    return transform.transform(data, ['company_id', 'company_name']);
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
        'company_id',
        'company_name',
        'shift_name',
        'date',
        'is_time_keeping',
        'time_start',
        'time_end',
        'date_create',
        'is_review',
        'have_permission',
        'department_id',
        'department_name',
        'min_date',
        'max_date',
        'range',
        'week_in_date',
        'shift_date_month',
        'status_check',
        'business_name',
        'disabled',
        'is_can_edit',
        'is_overtime',
        'user_review_list',
        'is_review_all',
        'created_user',
        'created_date',
    ]);
};
const timekeepingDetail = (data = []) => {
    return transform.transform(data, [
        'time_end',
        'time_start',
        'user_confirm',
        'time_keeping_id',
        'fullName',
        'total_time',
    ]);
};

const timeWordInWeek = (data = []) => {
    return transform.transform(data, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
};
const minMaxTime = (data = []) => {
    return transform.transform(data, ['min_date', 'max_date']);
};
const dataUserReview = (data = []) => {
    return transform.transform(data, ['user_name']);
};

const option = (data = []) => {
    let transformOpts = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transformOpts.transform(data, ['id', 'name']);
};

const shiftDate = (data = []) => {
    let transformOpts = new Transform({
        schedule_id: '{{#? SCHEDULEID}}',
        shift_date: '{{#? SHIFTDATE}}',
    });
    return transformOpts.transform(data, ['schedule_id', 'shift_date']);
};

const currentShift = (data = []) => {
    let transformOpts = new Transform({
        shift_id: '{{#? SHIFTID}}',
        shift_date: '{{#? SHIFTDATE}}',
        store_id: '{{#? STOREID*1}}',
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        company_id: '{{#? COMPANYID*1}}',
        minutes_start: '{{#? MINUTESTART}}',
        minutes_end: '{{#? MINUTEEND}}',
        time_start: '{{#? TIMESTART}}',
        time_end: '{{#? TIMEEND}}',
    });

    return transformOpts.transform(data, [
        'shift_id',
        'shift_date',
        'store_id',
        'business_id',
        'business_name',
        'company_id',
        'minutes_start',
        'minutes_end',
        'time_start',
        'time_end',
    ]);
};

const listReview = (data = []) => {
    const template = {
        shift_review_id: '{{#? SHIFTREIVEWID }}',
        is_review: '{{ ISREVIEW ? ISREVIEW : 0 }}',
        user_review: '{{#? USERREVIEW }}',
        department_review_name: '{{#? DEPARTMENTREVIEWNAME}}',
        review_note: '{{#? REVIEWNOTE}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const exportSchedule = (data = []) => {
    return transform.transform(data, [
        'store_id',
        'shift_id',
        'shift_date',
        'schedule_id',
        'user_fullname',
        'user_name',
        'store_name',
        'company_id',
        'company_name',
        'shift_name',
        'date',
        'is_time_keeping',
        'time_start',
        'time_end',
        'date_create',
        'is_review',
        'have_permission',
        'department_id',
        'department_name',
        'min_date',
        'max_date',
        'range',
        'week_in_date',
        'shift_date_month',
        'status_check',
        'business_name',
        'disabled',
        'is_can_edit',
        'is_overtime',
        'user_review_list',
        'is_review_all',
        'created_user',
        'created_date',
        'erp_code',
        'hour_start',
        'hour_end',
        'time_keeping',
    ]);
};

module.exports = {
    listUser,
    listStore,
    listSchedule,
    listShift,
    timekeepingDetail,
    listDepartment,
    listBusiness,
    listCompany,
    timeWordInWeek,
    minMaxTime,
    listShiftOption,
    dataUserReview,
    option,
    shiftDate,
    currentShift,
    listReview,
    exportSchedule,
};
