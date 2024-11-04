const Transform = require('../../common/helpers/transform.helper');

const template = {
    order_id: '{{#? ORDERID}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    receiverslip_date: '{{#? CREATEDDATE}}',
    code: '{{#? ORDERNO}}',
    explain: '{{#? EXPLAIN}}', //NGAY HOA DON
    invoice_no: '{{#? ORDERINVOICENO}}',
    notes: '{{#? NOTES}}',
    product_display_name: '{{#? PRODUCTDISPLAYNAME}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    unit: '{{#? UNITNAME}}',
    price: '{{#? PRICE}}',
    revenue_account: '{{#? REVENUEACCOUNTID}}',
    debt_account: '{{#? DEBTACCOUNTID}}',
    discount_value: '{{#? DISCOUNTVALUE}}',
    vat: '{{#? VAT}}',
    total_pay: '{{#? TOTALPAY}}',
    total_sell: '{{#? TOTALSELL}}',
    total_money_order: '{{#? TOTALMONEYORDER}}',
    total_vat: '{{#? TOTALVAT}}',
    total_payment: '{{#? TOTALPAYMENT}}',
    stocks_name: '{{#? STOCKSNAME}}',
    money: '{{#? MONEY}}', //DON GIA VON
    code_stocks: '{{#? CODESTOCKS}}', //MA KHO
    account_money: '{{#? ACCOUNTMONEY}}', //TK GIA VON
    account_stocks: '{{#? ACCOUNTSTOCKS}}', //TK KHO
    cost_price: '{{#? COSTPRICE}}', //
    total_amount: '{{#? TOTALAMOUNT}}', //TK KHO
    imei: '{{#? IMEICODE}}', //TK KHO
}

let transform = new Transform(template);

const totalMoney = (data) => {
    return transform.transform(data, ['total_money_order', 'total_vat', 'total_payment', 'total_amount'])
}

const list = (data = []) => {
    return transform.transform(data, [
        'accounting_date',
        'receiverslip_date',
        'code',
        'explain',
        'invoice_no',
        'notes',
        'product_display_name',
        'product_code',
        'product_name',
        'unit',
        'price',
        'revenue_account',
        'debt_account',
        'discount_value',
        'vat',
        'total_pay',
        'customer_name',
        'customer_code',
        'total_sell',
        'order_id',
    ]);
} 

const listAccounting = (data = []) => {
    return transform.transform(data, [
        'accounting_date',
        'receiverslip_date',
        'code',
        'explain',
        'invoice_no',
        'notes',
        'product_display_name',
        'product_code',
        'product_name',
        'unit',
        'price',
        'revenue_account',
        'debt_account',
        'discount_value',
        'vat',
        'total_pay',
        'customer_name',
        'customer_code',
        'total_sell',
        'order_id',
        'stocks_name',
        'money',
        'code_stocks',
        'account_money',
        'account_stocks',
        'cost_price',
        'imei'
    ]);
} 

module.exports = {
    list,
    totalMoney,
    listAccounting
}