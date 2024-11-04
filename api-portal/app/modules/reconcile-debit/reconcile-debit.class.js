const Transform = require('../../common/helpers/transform.helper');

const template = {
    // voucher list =>
    voucher_id: '{{#? VOUCHERID }}',
    voucher_code: '{{#? VOUCHERCODE }}',
    descriptions: '{{#? DESCRIPTIONS }}',
    accounting_date: '{{#? ACCOUNTINGDATE }}',
    payment_value: '{{ PAYMENTVALUE ? PAYMENTVALUE * 1 : 0 }}',
    total_money: '{{ TOTALMONEY ? TOTALMONEY * 1 : 0  }}',
    change_money: '{{ CHANGEMONEY ? CHANGEMONEY * 1 : 0  }}',
    voucher_type: '{{#? VOUCHERTYPE }}',

    // purchase order list =>
    invoice_date: '{{#? INVOICEDATE }}',
    purchase_order_code: '{{#? PURCHASEORDERCODE }}',
    invoice_no: '{{#? INVOICENO }}',
    payment_expire_date: '{{#? PAYMENTEXPIREDATE }}',
    invoice_note: '{{#? INVOICENOTE }}',
    sum_final_money: '{{ SUMFINALPAYMENTPRICE ? SUMFINALPAYMENTPRICE * 1 : 0  }}',
    paid_money: '{{ PAIDMONEY ? PAIDMONEY * 1 : 0  }}',
    remaining_money: '{{ REMAINIGMONEY ? REMAINIGMONEY * 1 : 0  }}',
    voucher_type: '{{#? VOUCHERTYPE }}',
    purchase_order_id: '{{#? PURCHASEORDERID }}',
    invoice_id: '{{#? INVOICEID }}',

    voucher_reconcile_money: '{{ VOUCHERRECONCILEMONEY ? VOUCHERRECONCILEMONEY * 1 : 0  }}',
    invoice_reconcile_money: '{{ INVOICERECONCILEMONEY ? INVOICERECONCILEMONEY * 1 : 0  }}',
    invoice_debt_money: '{{ INVOICEDEBTMONEY ? INVOICEDEBTMONEY * 1 : 0  }}',
    reconcile_history_detail_id: '{{#? RECONCILEHISTORYDETAILID }}',
};

let transform = new Transform(template);

const voucherList = (list = []) => {
    return transform.transform(list, [
        'voucher_id',
        'voucher_code',
        'descriptions',
        'accounting_date',
        'payment_value',
        'total_money',
        'voucher_type',
        'change_money',
    ]);
};

const paymentList = (list = []) => {
    return transform.transform(list, [
        'invoice_date',
        'purchase_order_code',
        'invoice_no',
        'payment_expire_date',
        'invoice_note',
        'sum_final_money',
        'paid_money',
        'remaining_money',
        'voucher_type',
        'purchase_order_id',
        'invoice_id',
    ]);
};

const historyList = (list = []) => {
    return transform.transform(list, [
        'voucher_id',
        'voucher_type',
        'voucher_code',
        'accounting_date',
        'invoice_date',
        'voucher_reconcile_money',
        'purchase_order_id',
        'purchase_order_code',
        'invoice_no',
        'invoice_reconcile_money',
        'invoice_debt_money',
        'reconcile_history_detail_id',
    ]);
};

module.exports = {
    voucherList,
    paymentList,
    historyList,
};
