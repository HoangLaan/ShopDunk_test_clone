const Transform = require('../../common/helpers/transform.helper');

const template = {
    supplier_id: '{{#? CUSTOMERID }}',
    customer_type: '{{#? CUSTOMERTYPE}}',
    debt_arise_money: '{{ DEBTARISEMONEY ? DEBTARISEMONEY * 1 : 0  }}',
    credit_arise_money: '{{ CREDITARISEMONEY ? CREDITARISEMONEY * 1 : 0  }}',
    customer_name: '{{#? CUSTOMERNAME }}',
    customer_code: '{{#? CUSTOMERCODE }}',
    debt_begin_money: '{{ DEBTBEGINMONEY ? DEBTBEGINMONEY * 1 : 0 }}',
    credit_begin_money: '{{CREDITBEGINMONEY ? CREDITBEGINMONEY * 1 : 0 }}',

    accounting_date: '{{#? ACCOUNTINGDATE }}',
    accounting_id: '{{#? ACCOUNTINGID }}',
    voucher_code: '{{#? VOUCHERCODE }}',
    voucher_date: '{{#? VOUCHERDATE }}',
    explain: '{{#? EXPLAIN }}',
    main_acc_code: '{{#? MAINACCCODE }}',
    sub_acc_code: '{{#? SUBACCCODE }}',
    bank_account: '{{#? BANKACCOUNTNUMBER }}',
    debt_arise_money_prev: '{{ DEBTARISEMONEYPREV ? DEBTARISEMONEYPREV * 1 : 0  }}',
    credit_arise_money_prev: '{{ CREDITARISEMONEYPREV ? CREDITARISEMONEYPREV * 1 : 0  }}',
    id: '{{#? ID }}',
    type_account: '{{#? TYPEACCOUNT }}',
    payment_type: '{{#? PAYMENTTYPE }}',
};

let transform = new Transform(template);

const list = (obj) => {
    return transform.transform(obj, [
        'supplier_id',
        'customer_type',
        'debt_arise_money',
        'credit_arise_money',
        'customer_name',
        'customer_code',
        'debt_begin_money',
        'credit_begin_money',
    ]);
};

const detail = (list = []) => {
    return transform.transform(list, [
        'supplier_id',
        'customer_type',
        'debt_arise_money',
        'credit_arise_money',
        'customer_name',
        'customer_code',
        'debt_begin_money',
        'credit_begin_money',
        'accounting_date',
        'accounting_id',
        'voucher_code',
        'voucher_date',
        'explain',
        'main_acc_code',
        'sub_acc_code',
        'bank_account',
        'debt_arise_money_prev',
        'credit_arise_money_prev',
        'id',
        'type_account',
        'payment_type',
    ]);
};

const sumRecord = (list = []) => {
    const template = {
        total_credit_begin: '{{TOTALCREDITBEGIN ? TOTALCREDITBEGIN * 1 : 0 }}',
        total_debt_begin: '{{ TOTALDEBTBEGIN ?  TOTALDEBTBEGIN * 1 : 0 }}',
        total_credit_arise: '{{TOTALCREDITARISE ? TOTALCREDITARISE * 1 : 0 }}',
        total_debt_arise: '{{TOTALDEBTARISE ? TOTALDEBTARISE * 1 : 0 }}',
    };
    const transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const invoiceList = (list = []) => {
    const template = {
        other_acc_voucher_invoice_id: '{{#? OTHERACCVOUCHERINVOICEID }}',
        explain: '{{#? EXPLAIN }}',
        invoice_checking: '{{INVOICECHECKING ? 1 :0 }}',
        tax_type: '{{TAXTYPE ? 1 : 0 }}',
        origin_money: '{{#? ORIGINMONEY }}',
        vat_value: '{{#? VATVALUE }}',
        tax_acc_id: '{{#? TAXACCID }}',
        object_type: '{{#? OBJECTTYPE }}',
        object_id: '{{#? OBJECTID }}',
        invoice_no: '{{#? INVOICENO }}',
        invoice_date: '{{#? INVOICEDATE }}',
        invoice_form_no: '{{#? INVOICEFORMNO }}',
        invoice_serial: '{{#? INVOICESERIAL }}',
        vat_money: '{{#? VATMONEY }}',
        object_name: '{{#? OBJECTNAME }}',
    };
    const transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const options = (list = []) => {
    return transform.transform(list, [
        'installment_partner_code',
        'installment_partner_id',
        'installment_partner_logo',
        'installment_partner_name',
        'period_list',
    ]);
};

module.exports = {
    detail,
    list,
    sumRecord,
    invoiceList,
    options,
};
