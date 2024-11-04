const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    schedule_id: '{{#? SCHEDULEID}}',
    shift_id: '{{#? SHIFTID}}',
    shift_name: '{{#? SHIFTNAME}}',
    time_start: '{{TIMESTART ? TIMESTART : 00}}',
    time_end: '{{TIMEEND ? TIMEEND : 00}}',
    shift_time_start: '{{SHIFTTIMESTART ? SHIFTTIMESTART : 00}}',
    shift_time_end: '{{SHIFTTIMEEND ? SHIFTTIMEEND : 00}}',
    shift_date: '{{#? SHIFTDATE}}',
    day_of_week: '{{#? DAYOFWEEK}}',
    created_date: '{{#? CREATEDDATE}}',
    check_schedule: '{{#? CHECKSCHEDULE}}',
    time_total_shirt: '{{#? TIMETOTALSHIRT}}',
};

let transform = new Transform(template);

const list = (listLockShift = []) => {
    return transform.transform(listLockShift, [
        'schedule_id',
        'shift_id',
        'shift_name',
        'time_start',
        'time_end',
        'shift_time_start',
        'shift_time_end',
        'shift_date',
        'day_of_week',
        'created_date',
        'check_schedule',
        'time_total_shirt',
    ]);
};

module.exports = {
    list,
};
