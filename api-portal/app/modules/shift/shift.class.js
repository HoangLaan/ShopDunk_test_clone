const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    shift_id: '{{#? SHIFTID}}',
    shift_code: '{{#? SHIFTCODE}}',
    shift_name: '{{#? SHIFTNAME}}',
    shift_description: '{{#? DESCRIPTION}}',
    shift_hourstart: '{{HOURSTART?HOURSTART:00}}',
    shift_minutestart: '{{MINUTESTART?MINUTESTART:00}}',
    shift_hourend: '{{HOUREND?HOUREND:00}}',
    shift_minutend: '{{MINUTEEND?MINUTEEND:00}}',
    numberofworkday: '{{#? NUMBEROFWORKDAY}}',
    shift_hourbreakstart: '{{HOURBREAKSTART?HOURBREAKSTART:0}}',
    shift_minusbreakstart: '{{MINUTEBREAKSTART?0:MINUTEBREAKSTART}}',
    shift_hourbreakend: '{{HOURBREAKEND?HOURBREAKEND:0}}',
    shift_minusbreakend: '{{MINUTEBREAKEND?MINUTEBREAKEND:0}}',
    shift_isovertime: '{{ISOVERTIME?ISOVERTIME:0}}',
    shift_hourcheckin: '{{HOURCHECKIN?HOURCHECKIN:0}}',
    shift_minuscheckin: '{{MINUTECHECKIN?MINUTECHECKIN:0}}',
    shift_hourcheckout: '{{HOURCHECKOUT?HOURCHECKOUT:0}}',
    shift_minuscheckout: '{{MINUTECHECKOUT?MINUTECHECKOUT:0}}',
    shift_minutecheckinlate: '{{MINUTECHECKINLATE?MINUTECHECKINLATE:0}}',
    shift_minutecheckoutearly: '{{MINUTECHECKOUTEARLY?MINUTECHECKOUTEARLY:0}}',
    is_apply_week: '{{ISAPPLYALLDAY?1:0}}',
    is_apply_monday: '{{ISAPPLYMONDAY?1:0}}',
    is_apply_tuesday: '{{ISAPPLYTUESDAY?1:0}}',
    is_apply_wednesday: '{{ISAPPLYWEDNESDAY?1:0}}',
    is_apply_thursday: '{{ISAPPLYTHURSDAY?1:0}}',
    is_apply_friday: '{{ISAPPLYFRIDAY?1:0}}',
    is_apply_saturday: '{{ISAPPLYSATURDAY?1:0}}',
    is_apply_sunday: '{{ISAPPLYSUNDAY?1:0}}',
    shift_time: '{{SHIFTTIME?SHIFTTIME:0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_online: '{{ISONLINE ? 1 : 0}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    time_start: '{{#? TIMESTART}}',
    time_end: '{{#? TIMEEND}}',
    is_check_store: '{{ISCHECKSTORE ? 1 : 0}}',
    is_break_shift: '{{ISBREAKSHIFT ? 1 : 0}}',

    time_break_start: '{{#? TIMEBREAKSTART}}',
    time_break_end: '{{#? TIMEBREAKEND}}',
    time_checkin: '{{#? TIMECHECKIN}}',
    time_checkout: '{{#? TIMECHECKOUT}}',

    department_id: '{{#? DEPARTMENTID * 1}}',
    user_name: '{{#? USERNAME}}',

    shift_apply_stored_id: '{{#? SHIFTAPPLYSTOREID}}',
    is_support: '{{ISSUPPORT ? 1 : 0}}',
    is_market_research: '{{ISMARKETRESEARCH ? 1 : 0}}',
    is_training: '{{ISTRAINING ? 1 : 0}}',
};
let transform = new Transform(template);
const list = (data = []) => {
    return transform.transform(data, [
        'shift_id',
        'shift_code',
        'shift_name',
        'is_active',
        'time_start',
        'time_end',
        'numberofworkday',
        'shift_time',
        'shift_description',
        'is_support'
    ]);
};

const detail = (data = []) => {
    return transform.transform(data, [
        'shift_id',
        'shift_code',
        'shift_name',
        'shift_description',
        'shift_hourstart',
        'shift_minutestart',
        'shift_hourend',
        'shift_minutend',
        'numberofworkday',
        'shift_hourbreakstart',
        'shift_minusbreakstart',
        'shift_hourbreakend',
        'shift_minusbreakend',
        'shift_isovertime',
        'shift_hourcheckin',
        'shift_minuscheckin',
        'shift_hourcheckout',
        'shift_minuscheckout',
        'shift_minutecheckinlate',
        'shift_minutecheckoutearly',
        'is_apply_week',
        'is_apply_monday',
        'is_apply_tuesday',
        'is_apply_wednesday',
        'is_apply_thursday',
        'is_apply_friday',
        'is_apply_saturday',
        'is_apply_sunday',
        'shift_time',
        'is_active',
        'is_online',
        'time_start',
        'time_end',
        'time_break_start',
        'time_break_end',
        'time_checkin',
        'time_checkout',
        'is_check_store',
        'is_break_shift',
        'is_support',
        'is_market_research',
        'is_training',
    ]);
};

const list_working_shift = (data = []) => {
    return transform.transform(data, ['store_id', 'store_name']);
};

const list_shift_review = (list = []) => {
    return transform.transform(list, ['department_id', 'user_name']);
};

const templateStore = {
    store_id: '{{#? STOREID}}',
    store_code: '{{#? STORECODE}}',
    store_name: '{{#? STORENAME}}',
    address: '{{#? ADDRESS}}',
    business_name: '{{#? BUSINESSNAME}}',
    cluster_name: '{{#? CLUSTERNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
};

const list_store_apply = (list = []) => {
    return new Transform({ ...template, ...templateStore }).transform(list, [
        ...Object.keys(templateStore),
        'shift_id',
        'shift_apply_stored_id',
    ]);
};

const storeList = (data = []) => {
    return new Transform(templateStore).transform(data, Object.keys(templateStore));
};

module.exports = {
    list,
    list_working_shift,
    detail,
    list_shift_review,
    list_store_apply,
    storeList,
};
