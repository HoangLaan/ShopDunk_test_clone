const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const receiveslipPrint = (order) => {
    const transform = new Transform({
        customer_name: '{{#? FULLNAME}}',
        customer_address: '{{#? ADDRESSFULL}}',
        total_money: '{{#? TOTALMONEY}}',
        total_money_text: '{{#? TOTALMONEYTEXT}}',
        print_date: '{{#? PRINTDATE}}',
        note: '{{#? DESCRIPTIONS}}',
        receive_slip_no: '{{#? RECEIVESLIPCODE}}',
        company_name: '{{#? COMPANYNAME}}',
        company_address: '{{#? COMPANYADDRESS}}',
        company_phone_number: '{{#? COMPANYPHONENUMBER}}',
        company_email: '{{#? COMPANYEMAIL}}',
        company_fax: '{{#? COMPANYFAX}}',
        company_province_name: '{{#? COMPANYPROVINCENAME}}',
        attachment_count: '{{#? ATTACHMENTCOUNT}}',
    });
    return transform.transform(order, [
        'customer_name',
        'customer_address',
        'total_money_text',
        'total_money',
        'print_date',
        'note',
        'receive_slip_no',
        'company_name',
        'company_address',
        'company_phone_number',
        'company_email',
        'company_fax',
        'company_province_name',
        'attachment_count',
    ]);
};

const paymentslipPrint = (order) => {
    const transform = new Transform({
        customer_name: '{{#? FULLNAME}}',
        customer_address: '{{#? ADDRESSFULL}}',
        total_money: '{{#? TOTALMONEY}}',
        total_money_text: '{{#? TOTALMONEYTEXT}}',
        print_date: '{{#? PRINTDATE}}',
        note: '{{#? DESCRIPTIONS}}',
        payment_slip_no: '{{#? PAYMENTSLIPCODE}}',
        company_name: '{{#? COMPANYNAME}}',
        company_address: '{{#? COMPANYADDRESS}}',
        company_phone_number: '{{#? COMPANYPHONENUMBER}}',
        company_email: '{{#? COMPANYEMAIL}}',
        company_fax: '{{#? COMPANYFAX}}',
        company_province_name: '{{#? COMPANYPROVINCENAME}}',
        attachment_count: '{{#? ATTACHMENTCOUNT}}',
    });
    return transform.transform(order, [
        'customer_name',
        'customer_address',
        'total_money_text',
        'total_money',
        'print_date',
        'note',
        'payment_slip_no',
        'company_name',
        'company_address',
        'company_phone_number',
        'company_email',
        'company_fax',
        'company_province_name',
        'attachment_count',
    ]);
};

module.exports = {
    receiveslipPrint,
    paymentslipPrint
}