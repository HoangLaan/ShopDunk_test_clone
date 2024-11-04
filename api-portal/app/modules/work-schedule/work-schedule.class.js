const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const templateWorkSchedule = {
    work_schedule_id: '{{#? WORKSCHEDULEID}}',
    work_schedule_name: '{{#? WORKSCHEDULENAME}}',
    work_schedule_type_id: '{{#? WORKSCHEDULETYPEID}}',
    work_schedule_type_name: '{{#? WORKSCHEDULETYPENAME}}',
    order_id: '{{#? ORDERID}}',
    start_time: '{{#? STARTTIME}}',
    end_time: '{{#? ENDTIME}}',
    is_review: '{{ ISREVIEW ? 1 : 0}}',
    is_system: '{{ ISSYSTEM ? 1 : 0}}',
    is_active: '{{ ISACTIVE ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    review_info: '{{#? REVIEWINFO}}',
};
let transformWorkSchedule = new Transform(templateWorkSchedule);

const listWorkSchedule = (list = []) => {
    return transformWorkSchedule.transform(list, [
        'work_schedule_id',
        'work_schedule_name',
        'work_schedule_type_id',
        'work_schedule_type_name',
        'order_id',
        'is_review',
        'is_active',
        'is_system',
        'start_time',
        'end_time',
        'review_info',
        'created_date',
        'created_user',
    ]);
};

const detailWorkSchedule = (data = {}) => {
    return transformWorkSchedule.transform(data, [
        'work_schedule_id',
        'work_schedule_name',
        'work_schedule_type_id',
        'order_id',
        'is_active',
        'is_system',
        'start_time',
        'end_time',
        'review_info',
        'created_date',
        'created_user',
    ]);
};

const reviewList = (list = []) => {
    const template = {
        work_schedule_review_level_id: '{{#? WORKSCHEDULEREVIEWLEVELID}}',
        work_schedule_review_level_name: '{{#? WORKSCHEDULEREVIEWLEVELNAME}}',
        company_id: '{{#? COMPANYID}}',
        users: '{{#? USERS}}',
    };

    let transform = new Transform(template);
    return transform.transform(list, [
        'work_schedule_review_level_id',
        'work_schedule_review_level_name',
        'company_id',
        'users',
    ]);
};

const templateReviewUserAndAttachment = {
    user_id: '{{#? USERID}}',
    username: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
    user_review: '{{#? USERREVIEW}}',
    is_review: '{{ ISREVIEW ? ISREVIEW : (ISREVIEW === 0 ? 0 : 2) }}',
    work_schedule_review_level_name: '{{#? WORKSCHEDULEREVIEWLEVELNAME}}',
    work_schedule_review_level_id: '{{#? WORKSCHEDULEREVIEWLEVELID}}',
    attachment_path: [
        {
            '{{#if ATTACHMENTPATH}}': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    attachment_name: '{{#? ATTACHMENTNAME}}',
    attachment_id: '{{#? WORKSCHEDULEATTACHMENTID}}',
};

let transform2 = new Transform(templateReviewUserAndAttachment);

const detailUser = (user = {}) => {
    return transform2.transform(user, ['user_id', 'username', 'full_name']);
};

const detailInfoReview = (user = {}) => {
    return transform2.transform(user, ['is_review', 'user_review', 'work_schedule_review_level_id']);
};
const listInfoReview = (users = []) => {
    return transform2.transform(users, [
        'is_review',
        'user_review',
        'work_schedule_review_level_name',
        'work_schedule_review_level_id',
    ]);
};

const detailAttachment = (listAt = []) => {
    return transform2.transform(listAt, ['attachment_path', 'attachment_name', 'attachment_id']);
};

const orderApply = (data = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    }
    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    listWorkSchedule,
    reviewList,
    detailUser,
    detailInfoReview,
    detailWorkSchedule,
    detailAttachment,
    listInfoReview,
    orderApply
};
