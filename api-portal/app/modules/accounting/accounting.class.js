const Transform = require('../../common/helpers/transform.helper');

const template = {
    accounting_id: '{{#? ACCOUNTINGID }}',
    debt_account: '{{#? DEBTACCOUNT }}',
    credit_account: '{{#? CREDITACCOUNT}}',
    explain: '{{#? EXPLAIN}}',
    receive_slip_id: '{{#? RECEIVESLIPID}}',
    payment_slip_id: '{{#? PAYMENTSLIPID}}',
    code: '{{#? CODE}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    origin_date: '{{#? ORIGINDATE}}',
    money: '{{#? MONEY}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'accounting_id',
        'debt_account',
        'credit_account',
        'explain',
        'receive_slip_id',
        'payment_slip_id',
        'code',
        'accounting_date',
        'origin_date',
        'money',
        'created_user',
        'created_date',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'accounting_id',
        'debt_account',
        'credit_account',
        'explain',
        'receive_slip_id',
        'payment_slip_id',
        'code',
        'accounting_date',
        'origin_date',
        'money',
        'created_user',
        'created_date',
    ]);
};

module.exports = {
    detail,
    list,
};
