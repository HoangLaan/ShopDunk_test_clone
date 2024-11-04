const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
    order_invoice_id: '{{#? ORDERINVOICEID }}',
    order_invoice_no: '{{#? ORDERINVOICENO }}',
    order_invoice_form_no: '{{#? ORDERINVOICEFORMNO }}',
    order_invoice_serial: '{{#? ORDERINVOICESERIAL }}',
    order_invoice_transaction: '{{#? ORDERINVOICETRANSACTION }}',
    order_invoice_url: '{{#? ORDERINVOICEURL }}',
    updated_user: '{{#? UPDATEDUSER }}',
    updated_date: '{{#? UPDATEDDATE }}',
    order_invoice_note: '{{#? ORDERINVOICENOTE }}',
    order_invoice_date: '{{#? ORDERINVOICEDATE }}',
    order_id: '{{#? ORDERID }}',
    cancel_date: '{{#? CANCELDATE }}',
    cancel_reason: '{{#? CANCELREASON }}',
    invoice_announced_status: '{{#? INVOICEANNOUNCEDSTATUS }}',
    is_active: '{{ ISACTIVE ? 1: 0 }}',
    order_invoice_status: '{{#? ORDERINVOICESTATUS ? 1: 0  }}',
};

const list = (data = []) => {
    const _template = baseTemplate;
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
};
