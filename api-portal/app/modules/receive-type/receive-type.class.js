const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    receive_type_id: '{{#? RECEIVETYPEID}}',
    receive_type_name: '{{#? RECEIVETYPENAME}}',
    receive_type_code: '{{#? RECEIVETYPECODE}}',
    company_name: '{{#? COMPANYNAME}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    child_count: '{{CHILDCOUNT ? CHILDCOUNT : 0}}',

    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    parent_id: '{{#? PARENTID}}',
    note: '{{#? NOTE}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    id: '{{#? ID}}',
    name: '{{#? NAME}}',

    // BANK ACCOUNT
    bank_account_business_id: '{{#? BANKACCOUNTBUSSINESSID}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    bank_number: '{{#? BANKNUMBER}}',
    bank_logo: '{{#? BANKLOGO}}',
    bank_name: '{{#? BANKNAME}}',
    receive_type_parent_name: '{{#? RECEIVETYPEPARENTNAME}}',
    is_child: '{{ ISCHILD? 1 : 0 }}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'receive_type_id',
        'receive_type_name',
        'company_name',
        'description',
        'created_user',
        'child_count',
        'created_date',
        'is_active',
        'receive_type_code',
        'receive_type_parent_name',
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

const detail = (data) => {
    return transform.transform(data, [
        'receive_type_id',
        'receive_type_name',
        'receive_type_code',
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

const option = (data) => {
    return transform.transform(data, ['id', 'name']);
};

const tree = (list = []) => {
    return transform.transform(list, [
        'receive_type_id',
        'receive_type_name',
        'company_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'receive_type_code',
        'receive_type_parent_name',
        'parent_id',
        'is_child',
    ]);
};

module.exports = {
    list,
    detail,
    option,
    listBankAccount,
    tree,
};
