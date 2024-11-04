const Transform = require('../../common/helpers/transform.helper');

const template = {
    accounting_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
    accounting_account_code: '{{#? ACCOUNTINGACCOUNTCODE}}',
    accounting_account_name: '{{#? ACCOUNTINGACCOUNTNAME}}',
    child_count: '{{CHILDCOUNT ? CHILDCOUNT : 0}}',
    account_parent_id: '{{#? ACCOUNTPARENTID}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    property: '{{#? PROPERTY}}',
    description: '{{#? DESCRIPTION}}',
    note: '{{#? NOTE}}',
    created_user: '{{#? CREATEDUSER}}',
    full_name: '{{#? FULLNAME}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    //tree
    is_child: '{{ ISCHILD? 1 : 0 }}',
};

const defaultFields = [
    'accounting_account_id',
    'accounting_account_code',
    'accounting_account_name',
    'company_name',
    'property',
    'description',
    'created_user',
    'child_count',
    'full_name',
    'is_active',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [...defaultFields, 'company_id', 'is_system', 'note', 'account_parent_id']);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const options = (data = []) => {
    const template = {
        id: '{{#? ACCOUNTINGACCOUNTID}}',
        code: '{{#? ACCOUNTINGACCOUNTCODE}}',
        name: '{{#? ACCOUNTINGACCOUNTNAME}}',
    };
    return new Transform(template).transform(data, ['id', 'code', 'name']);
};

const tree = (data = []) => {
    return transform.transform(data, [...defaultFields, 'account_parent_id', 'is_child']);
};

module.exports = {
    detail,
    list,
    tree,
    options,
};
