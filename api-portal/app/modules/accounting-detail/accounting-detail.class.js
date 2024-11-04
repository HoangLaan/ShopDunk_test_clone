const Transform = require('../../common/helpers/transform.helper');

const template = {
    accounting_id: '{{#? ACCOUNTINGID }}',
    accounting_id: '{{#? ACCOUNTINGID }}',
    accounting_detail_id: '{{#? ACACCOUNTINGDETAILID }}',
    account_number: '{{#? ACCOUNTNUMBER }}',
    reciprocalacc: '{{#? RECIPROCALACC}}',
    arise_debit: '{{ARISEDEBIT ? ARISEDEBIT : 0}}',
    arise_credit: '{{ARISECREDIT ? ARISECREDIT : 0}}',
    explain: '{{#? EXPLAIN}}',
    code: '{{#? CODE}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    origin_date: '{{#? ORIGINDATE}}',
    receive_slip_id: '{{#? RECEIVESLIPID}}',
    payment_slip_id: '{{#? PAYMENTSLIPID}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    business_name: '{{#? BUSINESSNAME}}',
    invoice_no: '{{#? INVOICENO}}',
    type_account: '{{#? TYPEACCOUNT}}',
    user_name: '{{#? USERNAME}}',
    user_full_name: '{{#? USERFULLNAME}}',
    object_code: '{{#? OBJECTCODE}}',
    object_name: '{{#? OBJECTNAME}}',
    id: '{{#? ID}}',
    payment_form_ids: '{{#? PAYMENTFORMIDS}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'accounting_id',
        'accounting_detail_id',
        'account_number',
        'reciprocalacc',
        'arise_debit',
        'arise_credit',
        'explain',
        'code',
        'accounting_date',
        'origin_date',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'accounting_id',
        'accounting_detail_id',
        'account_number',
        'reciprocalacc',
        'arise_debit',
        'arise_credit',
        'explain',
        'code',
        'accounting_date',
        'origin_date',
        'receive_slip_id',
        'payment_slip_id',
        'payment_type',
        'business_name',
        'invoice_no',
        'type_account',
        'user_name',
        'user_full_name',
        'object_code',
        'object_name',
        'id',
        'payment_form_ids',
    ]);
};

module.exports = {
    detail,
    list,
};
