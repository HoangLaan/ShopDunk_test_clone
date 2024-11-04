const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_in_type_id: '{{#? STOCKSINTYPEID}}',
    stocks_in_type_name: '{{#? STOCKSINTYPENAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    is_transfer: '{{ISTRANSFER ? 1 : 0}}',
    is_purchase: '{{ISPURCHASE ? 1 : 0}}',
    is_inventory_control: '{{ISINVENTORYCONTROL ? 1 : 0}}',
    is_exchange_goods: '{{ISEXCHANGEGOODS ? 1 : 0}}',
    is_warranty: '{{ISWARRANTY ? 1 : 0}}',
    is_electronics_component: '{{ISDISASSEMBLEELECTRONICSCOMPONENT ? 1 : 0}}',
    is_internal: '{{ISINTERNAL ? 1 : 0}}',

    is_auto_reviewed: '{{ISAUTOREVIEWED ? 1 : 0}}',
    stocks_in_type: '{{STOCKSINTYPE ? STOCKSINTYPE : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    is_stocks_in_review: '{{#? ISSTOCKSINREVIEW}}',
    stocks_in_review_level_id: '{{#? STOCKSINTYPEREVIEWLEVELID}}',
    review_order_index: '{{REVIEWORDERINDEX  ? 1 : 0}}',
    is_completed_reviewed: '{{ISCOMPLETEDREVIEWED  ? 1 : 0}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    user_name: '{{#? USERNAME}}',
    users: '{{#? USERS}}',
    stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
    description: '{{#? DESCRIPTION}}',
    is_auto_review: '{{ISAUTOREVIEW  ? 1 : 0}}',
    name: '{{#? NAME}}',
    id: '{{#? ID}}',
    label: '{{#? NAME}}',
    value: '{{#? ID}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'stocks_in_type_id',
        'stocks_in_type_name',
        'stocks_in_type',
        'is_active',
        'created_date',
        'created_user',
        'is_deleted',
    ]);
};

const detail = (data) => {
    return transform.transform(data, [
        'stocks_in_type_id',
        'stocks_in_type_name',
        'is_active',
        'is_system',
        'created_date',
        'created_user',
        'description',
        'is_transfer',
        'is_purchase',
        'is_inventory_control',
        'is_exchange_goods',
        'is_warranty',
        'is_electronics_component',
        'is_warranty',
        'is_auto_review',
        'is_stocks_in_review',
        'stocks_in_review_level_list',
        'stocks_in_type',
    ]);
};

const listReviewLevel = (data = []) => {
    return transform.transform(data, [
        'stocks_in_review_level_id',
        'stocks_review_level_id',
        'is_auto_reviewed',
        'is_completed_reviewed',
        'department_id',
        'department_name',
        'user_name',
        'users',
        'name',
        'id',
        'value',
        'label',
    ]);
};

const listReviewUser = (data = []) => {
    return transform.transform(data, [
        'stocks_in_review_level_id',
        'stocks_review_level_id',
        'is_auto_reviewed',
        'is_completed_reviewed',
        'department_id',
        'department_name',
        'user_name',
        'users',
        'name',
        'id',
        'value',
        'label',
    ]);
};

const templateOption = {
    id: '{{#? STOCKSINTYPEID}}',
    name: '{{#? STOCKSINTYPENAME}}',
};

const option = (stocks_in_type = []) => {
    let transform = new Transform(templateOption);
    return transform.transform(stocks_in_type, ['id', 'name']);
};

const options = (data = []) => {
    return transform.transform(data, ['id', 'name', 'label', 'value', 'department_id']);
};

module.exports = {
    detail,
    list,
    listReviewLevel,
    option,
    options,
    listReviewUser,
};
