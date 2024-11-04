const Transform = require('../../common/helpers/transform.helper');

const template = {
    // Work Schedule Type
    transfer_shift_type_id: '{{#? TRANSFERSHIFTTYPEID}}',
    transfer_shift_type_name: '{{#? TRANSFERSHIFTTYPENAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_another_business: '{{ISANOTHERBUSINESS ? 1 : 0}}',
    is_complete: '{{#? ISCOMPLETEREVIEW}}',
    is_auto_review_child: '{{#? ISAUTOREVIEWCHILD}}',
    company_id: '{{#? COMPANYID}}',

    // Review Level
    transfer_shift_review_level_id: '{{#? TRANSFERSHIFTREVIEWLEVELID}}',
    transfer_shift_review_level_name: '{{#? REVIEWLEVELNAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    position_id: '{{#? POSITIONID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
    company_name: '{{#? COMPANYNAME}}',
    transfer_shift_level_user_id: '{{#? TRANSFERSHIFTLEVELUSERID}}',
    user_name: '{{#? USERNAME}}',

    // User options
    user_id: '{{#? USERID}}',
    user_review: '{{#? USERREVIEW}}',
};

const defaultFields = [
    'transfer_shift_type_id',
    'transfer_shift_type_name',
    'description',
    'is_another_business',
    'is_auto_review',
    'is_active',
    'is_system',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'transfer_shift_review_level_id',
        'transfer_shift_review_level_name',
        'user_name',
        'department_id',
        'department_name',
        'is_auto_review_child',
        'is_complete',
        'transfer_shift_level_user_id',
        'company_id'
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [...defaultFields, 'created_date', 'created_user']);
};

const listUserOptions = (data = []) => {
    return transform.transform(data, ['user_id', 'user_review']);
};

const listReviewLevel = (data = []) => {
    return transform.transform(data, [
        'transfer_shift_review_level_id',
        'transfer_shift_review_level_name',
        'department_id',
        'position_id',
        'department_name',
        'position_name',
        'company_name',
    ]);
};

module.exports = {
    detail,
    list,
    listReviewLevel,
    listUserOptions,
};
