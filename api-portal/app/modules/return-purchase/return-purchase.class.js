const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const templateProduct = {
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    cost_price: '{{ COSTPRICE ? COSTPRICE : 0}}',
    unit_name: '{{#? UNITNAME}}',
    vat_value: '{{ VATVALUE ? VATVALUE : 0}}',
};
const productsOfPO = (stocks = []) => {
    const templateOption = {
        ...templateProduct,
        stocks_in_detail_id: '{{#? STOCKSINDETAILID}}',
        imei: '{{#? PRODUCTIMEICODE}}',
        purchase_order_id: '{{ PURCHASEORDERID ? parseInt(PURCHASEORDERID) : null}}',
        created_date: '{{#? CREATEDDATEPO}}',
        purchase_order_code: '{{#? PURCHASEORDERCODE}}',
    };
    return new Transform(templateOption).transform(stocks, Object.keys(templateOption));
};

const orderInvoice = (stocks = []) => {
    const templateOption = {
        order_invoice_id: '{{#? ORDERINVOICEID}}',
        order_invoice_no: '{{#? ORDERINVOICENO}}',
        order_invoice_form_no: '{{#? ORDERINVOICEFORMNO}}',
        order_invoice_serial: '{{#? ORDERINVOICESERIAL}}',
        order_invoice_transaction: '{{#? ORDERINVOICETRANSACTION}}',
        order_invoice_url: '{{#? ORDERINVOICEURL}}',
        order_invoice_note: '{{#? ORDERINVOICENOTE}}',
        order_invoice_date: '{{#? ORDERINVOICEDATE}}',
        order_id: '{{#? ORDERID}}',
    };
    return new Transform(templateOption).transform(stocks, Object.keys(templateOption));
};
const products = (stocks = []) => {
    const template = {
        ...templateProduct,
        quantity: '{{ QUANTITY ? QUANTITY : 0}}',
    };
    return new Transform(template).transform(stocks, Object.keys(template));
};

module.exports = {
    productsOfPO,
    orderInvoice,
    products,
};
