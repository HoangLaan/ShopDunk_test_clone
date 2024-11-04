const Transform = require('../../common/helpers/transform.helper');

const template = {
    // Work Schedule Type
    work_schedule_type_id: '{{#? WORKSCHEDULETYPEID}}',
    work_schedule_type_name: '{{#? WORKSCHEDULETYPENAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_complete: '{{#? ISCOMPLETE}}',
    is_auto_review_child: '{{#? ISAUTOREVIEWCHILD}}',
    work_schedule_type_review_level_id: '{{#? WORKSCHEDULETYPEREVIEWLEVELID}}',
    work_schedule_review_level_user_id: '{{#? WORKSCHEDULEREVIEWLEVELUSERID}}',

    // Review Level
    work_schedule_review_level_id: '{{#? WORKSCHEDULEREVIEWLEVELID}}',
    work_schedule_review_level_name: '{{#? WORKSCHEDULEREVIEWLEVELNAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    position_id: '{{#? POSITIONID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
    company_name: '{{#? COMPANYNAME}}',

    // User options
    user_id: '{{#? USERID}}',
    user_review: '{{#? USERREVIEW}}',
    user_name: '{{#? USERNAME}}',

    // Reason
    work_schedule_reason: '{{#? WORKSCHEDULEREASON}}',
    description_reason: '{{#? DESCRIPTIONREASON}}',
    work_schedule_reason_id: '{{#? WORKSCHEDULEREASONID}}',
    work_schedule_type_reason_id: '{{#? WORKSCHEDULETYPEREASONID}}',
};

const defaultFields = [
    'work_schedule_type_id',
    'work_schedule_type_name',
    'description',
    'is_auto_review',
    'is_active',
    'is_system',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'work_schedule_review_level_id',
        'work_schedule_review_level_name',
        'user_name',
        'is_auto_review_child',
        'is_complete',
        'work_schedule_type_review_level_id',
        'work_schedule_review_level_user_id',
        'work_schedule_reason',
        'description_reason',
        'work_schedule_reason_id',
        'work_schedule_type_reason_id',
    ]);
};

const detailWorkScheduleType = (type, data = []) => {
    return transform.transform(data, [
        `default_account_id`,
        'work_schedule_type_id',
        `${type.toLowerCase()}_default_account_id`,
        `${type.toLowerCase()}_account_id`,
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listUserOptions = (data = []) => {
    return transform.transform(data, ['user_id', 'user_review']);
};

const listReviewLevel = (data = []) => {
    return transform.transform(data, [
        'work_schedule_review_level_id',
        'work_schedule_review_level_name',
        'department_id',
        'position_id',
        'department_name',
        'position_name',
        'company_name',
    ]);
};

const listWorkScheduleType = (type, data = []) => {
    return transform.transform(data, [`accounting_account_code`, `${type.toLowerCase()}_account_id`]);
};

const listAccountOptions = (data = []) => {
    return transform.transform(data, ['accounting_account_id', 'accounting_account_code', 'property']);
};

module.exports = {
    detail,
    list,
    listWorkScheduleType,
    listAccountOptions,
    detailWorkScheduleType,
    listReviewLevel,
    listUserOptions,
};
