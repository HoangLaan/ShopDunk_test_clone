const Transform = require('../../common/helpers/transform.helper');

const template = {
    ac_default_account_id: '{{#? ACDEFAULTACCOUNTID}}',
    ac_default_account_name: '{{#? ACDEFAULTACCOUNTNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    document_name: '{{#? DOCUMENTNAME}}',
    document_id: '{{#? DOCUMENTID}}',
    property: '{{#? PROPERTY}}',
    // updated_user: '{{#? UPDATEDUSER}}',

    // Default Account type
    accounting_account_code: '{{#? ACCOUNTINGACCOUNTCODE}}',
    accounting_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
    debt_account_id: '{{#? DEBTACCOUNTTID}}',
    credit_account_id: '{{#? CREDITACCOUNTTID}}',
    tax_account_id: '{{#? TAXACCOUNTTID}}',

    default_account_id: '{{#? DEFAULTACCOUNTTID}}',
    debt_default_account_id: '{{#? DEBTDEFAULTACCID}}',
    credit_default_account_id: '{{#? CREDITDEFAULTACCID}}',
    tax_default_account_id: '{{#? TAXDEFAULTACCID}}',
};

const defaultFields = [
    'ac_default_account_id',
    'ac_default_account_name',
    'document_name',
    'document_id',
    'is_active',
    'is_system',
    'created_user',
    'created_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const detailDefaultAccountType = (type, data = []) => {
    return transform.transform(data, [
        `default_account_id`,
        'ac_default_account_id',
        `${type.toLowerCase()}_default_account_id`,
        `${type.toLowerCase()}_account_id`,
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listDefaultAccountType = (type, data = []) => {
    return transform.transform(data, [`accounting_account_code`, `${type.toLowerCase()}_account_id`]);
};

const listAccountOptions = (data = []) => {
    return transform.transform(data, ['accounting_account_id', 'accounting_account_code', 'property']);
};

module.exports = {
    detail,
    list,
    listDefaultAccountType,
    listAccountOptions,
    detailDefaultAccountType,
};
