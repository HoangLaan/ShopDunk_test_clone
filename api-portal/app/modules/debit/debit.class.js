const Transform = require('../../common/helpers/transform.helper');

const template = {
    debit_id: '{{#? DEBITID}}',
    expired_date: '{{#? EXPIREDDATE}}',
    ref_id: '{{#? REFID}}',
    ref_link: '{{#? REFLINK}}',
    created_date: '{{#? CREATEDDATE}}',
    ref_code: '{{#? REFCODE}}',
    total_amount: '{{#? TOTALAMOUNT ? TOTALAMOUNT : 0}}',
    total_paid: '{{#? TOTALPAID ? TOTALPAID : 0}}',
    total_money: '{{#? TOTALMONEY ? TOTALMONEY : 0}}',
    debt_type_name: '{{#? DEBTTYPENAME}}',
    full_name: '{{#? FULLNAME}}',
    is_overdue: '{{#? ISOVERDUE ? ISOVERDUE : 0}}',
    order_id: '{{#? ORDERID}}',
    receiver_type: '{{#? RECEIVERTYPE}}',
    payment_expire_date: '{{#? PAYMENTEXPIREDATE}}',
    paid_time: '{{#? PAIDTIME}}',
    is_cod: '{{ISCOD ? 1 : 0}}',
    // Hieunm 20230202 thêm cột với công nợ
    type_slip: '{{#? TYPESLIP}}',
    type_slip_id: '{{#? TYPESLIPID}}',
    ref_type_slip: '{{#? REFTYPESLIP}}',
    invoice_id: '{{#? INVOICEID}}',
    purchase_order_invoice_id: '{{#? PURCHASEORDERINVOICEID}}',
    purchase_order_invoice_code: '{{#? PURCHASEORDERINVOICECODE}}',
    invoice_code: '{{#? INVOICECODE}}',
    debit_type: '{{#? DEBTTYPE}}',
    avatar: [
        {
            '{{#if AVATAR}}': `${process.env.DOMAIN_CDN}{{AVATAR}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    purchase_order_id: '{{#? PURCHASEORDERID}}',
    purchase_cost_id: '{{#? PURCHASECOSTSID}}',
    supplier_id: '{{#? SUPPLIERID}}',
    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    invoice_created_date: '{{#? INVOICECREATEDDATE}}'
};

let transform = new Transform(template);

const list = (areas = []) => {
    return transform.transform(areas, Object.keys(template));
};

const statistic = (data) => {
    const transform = new Transform({
        total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
        total_money_receivable: '{{TOTALMONEYRECEIVABLE ? TOTALMONEYRECEIVABLE : 0}}',
        total_money_pay: '{{TOTALMONEYPAY ? TOTALMONEYPAY : 0}}',
    });
    return transform.transform(data, ['total_money', 'total_money_receivable', 'total_money_pay']);
};

const listPaymentSlip = (data) => {
    const template = {
        debit_detail_id: '{{#? DEBITDETAILID}}',
        debit_id: '{{#? DEBITID}}',
        total_paid: '{{#? TOTALPAID}}',
        total_money: '{{#? TOTALMONEY}}',
        payment_slip_id: '{{#? PAYMENTSLIPID}}',
        payment_status: '{{#? PAYMENTSTATUS}}',
        payment_type: '{{#? PAYMENTTYPE}}',
        code: '{{#? CODE}}',
        created_user: '{{#? CREATEDUSER}}',
        created_date: '{{#? CREATEDDATE}}',
        puchase_order_id: '{{#? PURCHASEORDERID}}',
        puchase_costs_id: '{{#? PURCHASECOSTSID}}',
        purchase_order_code: '{{#? PURCHASEORDERCODE}}',
        invoice_no: '{{#? INVOICENO}}',
    };
    let transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

module.exports = {
    list,
    statistic,
    listPaymentSlip,
};
