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
    fromdate: '{{#? DATEOFFFROM  }}',
    todate: '{{#? DATEOFFTO  }}',
    user_refuse: '{{#? USERREFUSE  }}',
    created_user: '{{#? CREATEDUSER  }}',
    user_name: '{{#? USERNAME  }}',
    full_name: '{{#? FULLNAME  }}',
    values_off: '{{#? VALUESOFF  }}',
    is_day: '{{#? ISDAY  }}',
    is_hours: '{{#? ISHOURS  }}',
    total_name: '{{ CREATEDUSER +" - " + FULLNAME }}',
    range_date_off: '{{ DATEOFFFROM +" - " + DATEOFFTO }}',

    user_review: '{{#? USERREVIEW}}',
    user_review_name: '{{#? USERREVIEWNAME}}',
    user_review_avatar: [
        {
            '{{#if USERREVIEWAVATAR}}': `${config.domain_cdn}{{USERREVIEWAVATAR}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],

    total_time: '{{TOTALTIME ? TOTALTIME : 0}}',
    total_time_off: '{{TOTALTIMEOFF ? TOTALTIMEOFF : 0}}',
    time_can_off: '{{TIMECANOFF ? TIMECANOFF : 0}}',

    from_date: '{{#? DATEOFFFROM  }}',
    to_date: '{{#? DATEOFFTO  }}',
    offwork_review: '{{#? OFFWORKREVIEW  }}',

    review_note: '{{#? REVIEWNOTE  }}',
    review_date: '{{#? REVIEWDATE  }}',

    department_name: '{{#? DEPARTMENTNAME  }}',

    default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
    off_work_review_list_id: '{{#? OFFWORKREVIEWLISTID}}',

    user_refuse_full_name: '{{#? USERREFUSEFULLNAME  }}',
    user_refuse_department_name: '{{#? USERREFUSEDEPARTMENTNAME  }}',
    user_refuse_position_name: '{{#? USERREFUSEPOSITIONNAME  }}',
    is_can_review: '{{ISCANREVIEW ? 1 : 0}}',
    is_confirm: '{{ISCONFIRM ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = offwork => {
    return transform.transform(offwork, [
        'off_work_id',
        'is_refuse',
        'content_off_work',
        'off_work_type_id',
        'total_time_off',
        'user_refuse_department_name',
        'fromdate',
        'todate',
        'user_refuse',
        'is_approve',
        'user_name',
        'full_name',
        'user_refuse_full_name',
        'user_refuse_position_name',
        'is_confirm',
    ]);
};

const list = (offworks = []) => {
    return transform.transform(offworks, [
        'off_work_id',
        'is_approve',
        'from_date',
        'to_date',
        'total_time_off',
        'department_name',
        'created_date',
        'full_name',
        'off_work_type_name',
        'content_off_work',
        'user_refuse',
        'user_review',
        'user_review_name',
        'user_review_avatar',
    ]);
};

const dayoffwork = dateoff => {
    return transform.transform(dateoff, ['total_time', 'total_time_off', 'time_can_off', 'is_can_review']);
};

const detailOffWorkType = (offworkType = []) => {
    const template = {
        name: '{{#? NAME}}',
        id: '{{#? ID}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    };
    let transform = new Transform(template);
    return transform.transform(offworkType, ['id', 'name', 'is_auto_review']);
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

const offWorkAttachment = (list = []) => {
    const template = {
        attachment_id: '{{#? OFFWORKATTACHMENTID}}',
        attachment_name: '{{#? ATTACHMENTNAME}}',
        attachment_path: [
            {
                '{{#if ATTACHMENTPATH}}': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
            },
            {
                '{{#else}}': undefined,
            },
        ],
    };

    let transform = new Transform(template);

    return transform.transform(list, ['attachment_id', 'attachment_name', 'attachment_path']);
};

const listReview = (offworks = []) => {
    return transform.transform(offworks, [
        'off_work_id',
        'is_approve',
        'from_date',
        'to_date',
        'total_time_off',
        'department_name',
        'default_picture_url',
        'created_date',
        'full_name',
        'off_work_type_name',
        'content_off_work',
        'review_note',
        'review_date',
        'off_work_review_list_id',
        'user_refuse',
    ]);
};

const offWorkReview = (review = []) => {
    const template = {
        off_work_review_list_id: '{{#? OFFWORKREVIEWLISTID}}',
        off_review_level_id: '{{#? OFFWORKREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        review_user_fullname: '{{#? REVIEWUSERFULLNAME}}',
        default_picture: '{{#? DEFAULTPICTUREURL}}',
        review_date: '{{#? REVIEWEDDATE}}',
        review_note: '{{#? REVIEWNOTE}}',

        is_review: '{{ISREVIEW ? ISREVIEW : 0}}',
    };
    let transform = new Transform(template);
    return transform.transform(review, [
        'off_work_review_list_id',
        'off_review_level_id',
        'review_level_name',
        'review_user_fullname',
        'default_picture',
        'review_date',
        'review_note',
        'is_review',
    ]);
};

const options = (data = []) => {
    const template = {
        name: '{{#? NAME}}',
        id: '{{#? ID}}',
        department_name: '{{#? DEPARTMENTNAME  }}',
        default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        phone_number: `{{#? PHONENUMBER}}`,
    };
    let transform = new Transform(template);
    return transform.transform(data, ['id', 'name', 'department_name', 'default_picture_url', 'phone_number']);
};

const detailAttachment = (data = []) => {
    const template = {
        name: '{{#? ATTACHMENTNAME}}',
        link_attachment: [
            {
                '{{#if ATTACHMENTPATH}}': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    };
    let transform = new Transform(template);
    return transform.transform(data, ['name', 'link_attachment']);
};
module.exports = {
    list,
    dayoffwork,
    offWorkReviewList,
    detailOffWorkType,
    detail,
    listReview,
    offWorkReview,
    options,
    detailAttachment,
    offWorkAttachment,
};
