const Transform = require('../../common/helpers/transform.helper');

const template = {
    other_acc_voucher_id: '{{#? OTHERACCVOUCHERID }}',
    other_acc_voucher_code: '{{#? OTHERACCVOUCHERCODE}}',
    expend_type_id: '{{#? EXPENDTYPEID }}',
    receive_type_id: '{{#? RECEIVETYPEID }}',
    total_money: '{{#? TOTALMONEY }}',
    voucher_type_name: '{{#? VOUCHERTYPENAME }}',
    description: '{{#? DESCRIPTION }}',
    invoice_date: '{{#? INVOICEDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_merge_invoice: '{{ISMERGEINVOICE ? 1 : 0}}',
    not_declare_tax: '{{NOTDECLARETAX ? 1 : 0}}',
    is_bookkeeping: '{{ISBOOKKEEPING ? 1 : 0}}',
    payment_expired_date: '{{#? PAYMENTEXPIREDDATE}}',
    store_id: '{{#? STOREID}}',
    business_id: '{{#? BUSINESSID}}',
};

let transform = new Transform(template);

const list = (obj) => {
    return transform.transform(obj, [
        'other_acc_voucher_id',
        'other_acc_voucher_code',
        'expend_type_id',
        'receive_type_id',
        'total_money',
        'description',
        'invoice_date',
        'created_user',
        'voucher_type_name',
        'created_date',
        'is_bookkeeping',
        'payment_expired_date',
    ]);
};

const detail = (list = []) => {
    return transform.transform(list, [
        'other_acc_voucher_id',
        'other_acc_voucher_code',
        'expend_type_id',
        'receive_type_id',
        'total_money',
        'description',
        'invoice_date',
        'created_date',
        'is_bookkeeping',
        'payment_expired_date',
        'is_merge_invoice',
        'not_declare_tax',
        'store_id',
        'business_id',
    ]);
};

const accountingList = (list = []) => {
    const template = {
        other_acc_voucher_detail_id: '{{#? OTHERACCVOUCHERDETAILID }}',
        note: '{{#?  NOTE }}',
        debt_acc_id: '{{#? DEBTACCID }}',
        credit_acc_id: '{{#? CREDITACCID }}',
        money: '{{#? MONEY }}',
        debt_object_type: '{{#? DEBTOBJECTTYPE }}',
        expend_type_id: '{{#? EXPENDTYPEID }}',
        receive_type_id: '{{#? RECEIVETYPEID }}',
        debt_object_id: '{{#? DEBTOBJECTID }}',
        debt_object_name: '{{#? DEBTOBJECTNAME }}',
        credit_object_type: '{{#? CREDITOBJECTTYPE }}',
        credit_object_id: '{{#? CREDITOBJECTID }}',
        credit_object_name: '{{#? CREDITOBJECTNAME }}',
        debt_code: '{{#? DEBTCODE }}',
        credit_code: '{{#? CREDITCODE }}',
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

const attachmentList = (list = []) => {
    const template = {
        other_acc_voucher_attachment_id: '{{#? OTHERACCVOUCHERATTACHMENTID }}',
        attachment_name: '{{#? ATTACHMENTNAME }}',
        attachment_path: '{{#? ATTACHMENTPATH }}',
        file_ext: '{{#? ATTACHMENTEXTENSION }}',
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
    accountingList,
    invoiceList,
    attachmentList,
    options,
};
