const Transform = require('../../common/helpers/transform.helper');

const template = {
    //list
    purchase_cost_id: '{{#? PURCHASECOSTSID}}',
    supplier_id: '{{#? SUPPLIERID}}',
    supplier_code: '{{#? SUPPLIERCODE}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    accounting_date: '{{#? PCDATE}}',
    payment_date: '{{#? INVOICEDATE}}',
    payment_code: '{{#? INVOICENO}}',
    payment_form_id: '{{#? ISPOSTATUSID}}',
    tax_code: '{{#? TAXCODE}}',
    cost_type_id: '{{#? EXPENDTYPEID}}',
    is_payments_status_id: '{{ ISPAYMENTSSTATUSID}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    employee_purchase: '{{#? EMPLOYEEPURCHASE}}',
    employee_purchase_name: '{{#? EMPLOYEEPURCHASENAME}}',
    cost_name: '{{#? COSTNAME}}',
    stocks_in_code: '{{#? STOCKSINCODE}}',
    purchase_order_code: '{{#? PURCHASEORDERCODE}}',
    purchase_cost_note: '{{#? PURCHASECOSTSNOTE}}',
    address: '{{#? ADDRESS}}',
    order_status_id: '{{#? ORDERSTATUSID}}',
    is_active: '{{#? ISACTIVE ?? 0}}',
    purchase_cost_account_id: '{{#? PURCHASECOSTACCOUNTID}}',
    purchase_cost_detail_id: '{{#? PURCHASECOSTSDETAILID}}',
    debt_account: '{{#? DEBTACCID}}',
    credit_account: '{{#? CREDITACCID}}',
    tax_account: '{{#? TAXACCID}}',
    cost_money: '{{#? PAYMENTMONEY}}',
    vat_money: '{{#? INVOICEVAT}}',
    return_vat_money: '{{#? INVOICEVATMONEY}}',
    money: '{{#? TOTALMONEY}}',
    description: '{{#? DESCRIPTION}}',
    explain: '{{#? EXPLAIN}}',
    purchase_order_id: '{{#? PURCHASEORDERID}}',
    total_purchase_cost: '{{#? TOTALPURCHASECOST}}',
    purchase_order_order_id: '{{#? PURCHASEORDERID}}',
    accounting_id: '{{#? ACCOUNTINGID}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'purchase_cost_id',
        'supplier_code',
        'supplier_name',
        'cost_name',
        'stocks_in_code',
        'purchase_order_code',
        'accounting_date',
        'payment_date',
        'payment_code',
        'payment_form_id',
        'employee_purchase_name',
        'is_payments_status_id',
        'order_status',
        'purchase_cost_note',
        'created_user',
        'created_date',
        'tax_code',
        'total_purchase_cost',
    ]);
};

const detail = (list = []) => {
    return transform.transform(list, [
        'purchase_cost_id',
        'supplier_id',
        'supplier_code',
        'cost_type_id',
        'stocks_in_code',
        'purchase_order_code',
        'accounting_date',
        'payment_date',
        'payment_code',
        'payment_form_id',
        'is_payments_status_id',
        'order_status',
        'purchase_cost_note',
        'created_user',
        'created_date',
        'tax_code',
        'address',
        'employee_purchase',
        'order_status_id',
        'is_active',
        'purchase_cost_account_id',
        'purchase_order_order_id',
    ]);
};

const detailAccounting = (list = []) => {
    return transform.transform(list, [
        'purchase_cost_id',
        'purchase_cost_detail_id',
        'debt_account',
        'credit_account',
        'tax_account',
        'cost_money',
        'vat_money',
        'return_vat_money',
        'money',
        'description',
        'explain',
        'purchase_order_id',
        'cost_type_id',
        'accounting_id',
    ]);
};

module.exports = {
    list,
    detail,
    detailAccounting,
};
