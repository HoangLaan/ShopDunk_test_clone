const Transform = require('../../common/helpers/transform.helper');

const template = {
    customer_care_type_id: '{{#? CUSTOMERCARETYPEID}}',
    customer_care_type_name: '{{#? CUSTOMERCARETYPENAME}}',
    note: '{{#? NOTE}}',
    is_birthday: '{{ISBIRTHDAY ? 1 : 0}}',
    is_wedding_anniversary: '{{ISWEDDINGANNIVERSARY ? 1 : 0}}',
    is_time_not_buying: '{{ISTIMENOTBUYING ? 1 : 0}}',
    is_final_buy: '{{ISFINALBUY ? 1 : 0}}',
    is_filter_daily: '{{ISFILTERDAILY ? 1 : 0}}',
    is_filter_monthly: '{{ISFILTERMONTHLY ? 1 : 0}}',
    value_time_note_buying: '{{#? VALUETIMENOTBUYING}}',
    time_final_buy: '{{#? TIMEFINALBUY}}',
    time_value: '{{#? TIMEVALUE}}',
    date_value: '{{#? DATEVALUE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    //User
    receiver_id: '{{#? RECEIVERID}}',
    user_id: '{{#? USERID}}',
    full_name: '{{#? FULLNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
};

const defaultFields = [
    'customer_care_type_id',
    'customer_care_type_name',
    'note',
    'is_filter_daily',
    'is_filter_monthly',
    'time_value',
    'date_value',
    'is_active',
    'is_system',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'is_birthday',
        'is_wedding_anniversary',
        'is_time_not_buying',
        'is_final_buy',
        'is_filter_daily',
        'is_filter_monthly',
        'time_final_buy',
        'value_time_note_buying',
        'time_value',
        'date_value',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listUser = (data = []) => {
    return transform.transform(data, ['user_id', 'full_name', 'department_name', 'position_name']);
};

module.exports = {
    detail,
    list,
    listUser,
};
