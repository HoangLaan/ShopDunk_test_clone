const Transform = require('../../common/helpers/transform.helper');

const template = {
    id: '{{#? ID }}',
    code: '{{#? CODE }}',
    type: '{{#? TYPE }}',
    total_money: '{{#? TOTALMONEY}}',
    descriptions: '{{#? DESCRIPTIONS}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    bank_account_number: '{{#? BANKACCOUNTNUMBER}}',
    receiver_id: '{{#? RECEIVERID}}',
    receive_type_name: '{{#? RECEIVETYPENAME}}',
    expend_type_name: '{{#? EXPENDTYPENAME}}',
    receiver_name: '{{#? RECEIVERNAME}}',
    review_status: '{{#? REVIEWSTATUS}}',
    company_name: '{{#? COMPANYNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    store_name: '{{#? STORENAME}}',
    purchase_order_id: '{{#? PURCHASEORDERID}}',
    previous_money: '{{PREVIOUSMONEY ? PREVIOUSMONEY : 0}}',
    is_book_keeping: '{{ISBOOKKEEPING ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'id',
        'code',
        'type',
        'total_money',
        'descriptions',
        'accounting_date',
        'bank_account_number',
        'receiver_id',
        'receive_type_name',
        'expend_type_name',
        'receiver_name',
        'review_status',
        'company_name',
        'business_name',
        'store_name',
        'purchase_order_id',
        'is_book_keeping',
        'previous_money',
        'created_date',
    ]);
};

const statistics = (obj) => {
    const template = {
        total_receive_by_year: '{{#? TOTALRECEIVEBYYEAR}}',
        total_expend_by_year: '{{#? TOTALEXPENDBYYEAR}}',
        total_receive_by_month: '{{#? TOTALRECEIVEBYMONTH}}',
        total_expend_by_month: '{{#? TOTALEXPENDBYMONTH}}',
        total_fund: '{{#? TOTALFUND}}',
    };

    const transform = new Transform(template);

    return transform.transform(obj, [
        'total_receive_by_year',
        'total_expend_by_year',
        'total_receive_by_month',
        'total_expend_by_month',
        'total_fund',
    ]);
};

const options = (list = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        parent_id: '{{#? PARENTID}}',
        description: '{{#? DESCRIPTION}}',
    };
    const transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

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
        accounting_date: '{{#? ACCOUNTINGDATE}}',
        bank_name: '{{#? BANKNAME}}',
        bank_number: '{{#? BANKNUMBER}}',
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
        'bank_name',
        'bank_number',
        'accounting_date',
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
        accounting_date: '{{#? ACCOUNTINGDATE}}',
        bank_name: '{{#? BANKNAME}}',
        bank_number: '{{#? BANKNUMBER}}',
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
        'accounting_date',
        'bank_name',
        'bank_number',
    ]);
};

const accountingList = (order) => {
    const transform = new Transform({
        accounting_id: '{{#? ACCOUNTINGID}}',
        explain: '{{#? EXPLAIN}}',
        money: '{{#? MONEY}}',
        debt_account_code: '{{#? DEBTACCOUNTCODE}}',
        credit_account_code: '{{#? CREDITACCOUNTCODE}}',
    });
    return transform.transform(order, [
        'accounting_id',
        'explain',
        'money',
        'debt_account_code',
        'credit_account_code',
    ]);
};

const reviewList = (data = []) => {
    const _template = {
        payment_slip_id: '{{#? PAYMENTSLIPID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        review_date: '{{#? REVIEWDATE}}',
        user_review: '{{#? USERREVIEW}}',
        is_review: '{{ISREVIEW === null ? 2 : ISREVIEW}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete_review: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    statistics,
    options,
    receiveslipPrint,
    paymentslipPrint,
    accountingList,
    reviewList,
};
