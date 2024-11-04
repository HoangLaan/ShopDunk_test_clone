const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    is_approve: '{{ISAPPROVE ? ISAPPROVE : 0}}',
    is_refuse: '{{ISREFUSE ? 1 : 0}}',
    off_work_id: '{{#? OFFWORKID}}',
    off_work_type_id: '{{#? OFFWORKTYPEID}}',
    off_work_type_name: '{{#? OFFWORKNAME}}',
    content_off_work: '{{#? CONTENTOFFWORK  }}',
    created_date: '{{#? CREATEDDATE  }}',
    user_refuse: '{{#? USERREFUSE  }}',
    created_user: '{{#? CREATEDUSER  }}',
    user_name: '{{#? USERNAME  }}',
    full_name: '{{#? FULLNAME  }}',
    values_off: '{{#? VALUESOFF  }}',
    is_day: '{{#? ISDAY  }}',
    is_hours: '{{#? ISHOURS  }}',
    total_name: '{{ CREATEDUSER +" - " + FULLNAME }}',
    range_date_off: '{{ DATEOFFFROM +" - " + DATEOFFTO }}',

    total_time: '{{TOTALTIME ? TOTALTIME : 0}}',
    total_time_off: '{{TOTALTIMEOFF ? TOTALTIMEOFF : 0}}',
    time_can_off: '{{TIMECANOFF ? TIMECANOFF : 0}}',
    is_confirm: '{{ISCONFIRM ? 1 : (ISCONFIRM === 0 ? 0 : null)}}',
    start_hour: '{{#? STARTHOUR  }}',
    end_hour: '{{#? ENDHOUR  }}',

    from_date: '{{#? DATEOFFFROM  }}',
    to_date: '{{#? DATEOFFTO  }}',
    offwork_review: '{{#? OFFWORKREVIEW  }}',

    department_id: '{{#? DEPARTMENTID  }}',

    department_name: '{{#? DEPARTMENTNAME  }}',
    user_refuse_full_name: '{{#? USERREFUSEFULLNAME  }}',

    is_can_review: '{{ISCANREVIEW ? ISCANREVIEW : 0}}',

    schedule_id: '{{#? SCHEDULEID  }}',
    shift_id: '{{#? SHIFTID  }}',
    shift_name: '{{#? SHIFTNAME  }}',
    time_start: '{{#? TIMESTART  }}',
    time_end: '{{#? TIMEEND  }}',
    shift_date: '{{#? SHIFTDATE  }}',

    // SCHEDULE
    off_work_schedule_id: '{{#? OFFWORKSCHEDULEID  }}',
    erp_code: '{{#?  MAERP  }}',
    default_picture_url: '{{#?  DEFAULTPICTUREURL }}',
};

let transform = new Transform(template);

const detail = (offwork) => {
    return transform.transform(offwork, [
        'off_work_id',
        'is_refuse',
        'content_off_work',
        'off_work_type_id',
        'total_time_off',
        'from_date',
        'to_date',
        'user_refuse',
        'is_approve',
        'user_name',
        'full_name',
        'department_id',
        'department_name',
        'user_refuse_full_name',
        'is_confirm',
        'start_hour',
        'end_hour',
        'default_picture_url',
    ]);
};

const list = (offworks = []) => {
    return transform.transform(offworks, [
        'off_work_id',
        'is_approve',
        'from_date',
        'to_date',
        'total_time_off',
        'created_date',
        'full_name',
        'off_work_type_name',
        'offwork_review',
        'is_can_review',
        'is_confirm',
        'content_off_work',
        'user_name',
        'erp_code',
    ]);
};

const dayoffwork = (dateoff) => {
    return transform.transform(dateoff, ['total_time', 'total_time_off', 'time_can_off']);
};

const detailOffWorkType = (offworkType = []) => {
    const template = {
        name: '{{#? NAME}}',
        id: '{{#? ID}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        values_off: '{{VALUESOFF ? VALUESOFF : 0}}',
        is_day: '{{ISDAY ? 1 : 0}}',
        is_hour: '{{ISHOUR ? 1 : 0}}',
        is_sub_time_off: '{{ISSUBTIMEOFF ? 1 : 0}}',
        max_day_off: '{{MAXDAYOFF ? MAXDAYOFF : 0}}',
        before_day: '{{BEFOREDAY ? BEFOREDAY : 0}}',
    };
    let transform = new Transform(template);
    return transform.transform(offworkType, [
        'id',
        'name',
        'is_auto_review',
        'values_off',
        'is_day',
        'is_hour',
        'is_sub_time_off',
        'max_day_off',
        'before_day',
    ]);
};

const offWorkReviewList = (offworkType = []) => {
    const template = {
        review_date: '{{#? REVIEWEDDATE}}',
        note: '{{#? REVIEWNOTE}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_review: '{{ISREVIEW ? ISREVIEW : 0}}',
        review_user_full_name: '{{#? REVIEWUSERFULLNAME}}',
        review_user: '{{#? REVIEWUSER}}',
        default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        offwork_review_level_name: '{{#? REVIEWLEVELNAME}}',
        offwork_review_level_id: '{{#? OFFWORKREVIEWLEVELID}}',
        off_work_review_list_id: '{{#? OFFWORKREVIEWLISTID}}',
    };
    let transform = new Transform(template);
    return transform.transform(offworkType, [
        'review_date',
        'note',
        'is_auto_review',
        'is_review',
        'review_user_full_name',
        'review_user',
        'default_picture_url',
        'offwork_review_level_name',
        'offwork_review_level_id',
        'off_work_review_list_id',
    ]);
};

const offWorkREviewUsers = (users = []) => {
    const template = {
        user_id: '{{#? USERID}}',
        username: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        offwork_review_level_id: '{{#? OFFWORKREVIEWLEVELID}}',
    };
    let transform = new Transform(template);
    return transform.transform(users, ['user_id', 'full_name', 'username', 'is_review', 'offwork_review_level_id']);
};

const options = (users = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(users, ['id', 'name']);
};

const shiftInfo = (shift = []) => {
    return transform.transform(shift, [
        'schedule_id',
        'shift_id',
        'shift_name',
        'time_start',
        'time_end',
        'shift_date',
        'off_work_schedule_id',
    ]);
};

module.exports = {
    list,
    detail,
    dayoffwork,
    detailOffWorkType,
    offWorkReviewList,
    offWorkREviewUsers,
    options,
    shiftInfo,
};
