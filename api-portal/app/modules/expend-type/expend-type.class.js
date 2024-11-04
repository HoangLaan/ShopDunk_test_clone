const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    expend_type_id: '{{#? EXPENDTYPEID}}',
    expend_type_name: '{{#? EXPENDTYPENAME}}',
    expend_type_code: '{{#? EXPENDTYPECODE}}',
    company_name: '{{#? COMPANYNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    parent_name: '{{#? PARENTNAME}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',

    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    parent_id: '{{#? PARENTID}}',
    note: '{{#? NOTE}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    value: '{{#? ID}}',
    title: '{{#? NAME}}',
    pId: '{{#? PARENTID}}',

    review_level_id: '{{#? REVIEWLEVELID}}',
    review_level_name: '{{#? REVIEWLEVELNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',

    review_level_id: '{{#? REVIEWLEVELID}}',
    review_level_name: '{{#? REVIEWLEVELNAME}}',
    user_review_list: '{{#? USERREVIEWLIST}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_complete_review: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
    order_index: '{{ ORDERINDEX ? ORDERINDEX : 0}}',

    // BANK ACCOUNT
    bank_account_business_id: '{{#? BANKACCOUNTBUSSINESSID}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    bank_number: '{{#? BANKNUMBER}}',
    bank_logo: [
        {
            '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    bank_name: '{{#? BANKNAME}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'expend_type_id',
        'expend_type_name',
        'expend_type_code',
        'company_name',
        'business_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'parent_name'
    ]);
};

const listBankAccount = (list = []) => {
    return transform.transform(list, [
        'bank_account_business_id',
        'business_id',
        'bank_account_name',
        'bank_number',
        'bank_logo',
        'bank_name',
    ]);
};

const reviewLevelList = (list = []) => {
    return transform.transform(list, [
        'review_level_id',
        'review_level_name',
        'company_name',
        'business_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'department_name',
        'position_name',
    ]);
};

const detail = (data) => {
    return transform.transform(data, [
        'expend_type_id',
        'expend_type_name',
        'expend_type_code',
        'parent_id',
        'company_id',
        'business_id',
        'note',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

const levelUserDetailList = (list = []) => {
    return transform.transform(list, [
        'review_level_id',
        'review_level_name',
        'user_review_list',
        'is_auto_review',
        'is_complete_review',
        'order_index',
    ]);
};

const option = (data) => {
    return transform.transform(data, ['id', 'name']);
};

const options = (data) => {
    return transform.transform(data, ['id', 'value', 'title', 'pId']);
};

module.exports = {
    list,
    detail,
    levelUserDetailList,
    option,
    options,
    reviewLevelList,
    listBankAccount,
};
