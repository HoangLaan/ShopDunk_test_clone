const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    payment_slip_id: '{{#? PAYMENTSLIPID}}',
    payment_slip_code: '{{#? PAYMENTSLIPCODE}}',
    receive_department_id: '{{#? RECEIVERDEPARTMENTID}}',
    payer_id: '{{#? PAYERID}}',
    payer_name: '{{#? PAYERNAME}}',
    total_money: '{{#? TOTALMONEY}}',
    payment_date: '{{#? PAYMENTDATE}}',
    expend_type_id: '{{#? EXPENDTYPEID}}',
    descriptions: '{{#? DESCRIPTIONS}}',
    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    store_id: '{{#? STOREID}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    is_review: '{{ISREVIEW ? ISREVIEW : 0 }}',
    payment_status: '{{PAYMENTSTATUS ? 1 : 0}}',
    receiver_type: '{{#? RECEIVERTYPE}}',
    receiver_id: '{{#? RECEIVERID}}',
    receiver_name: '{{#? RECEIVERNAME}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    is_deposit: '{{ISDEPOSIT ? 1 : 0}}',
    is_bookkeeping: '{{ISBOOKKEEPING ? 1 : 0}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    payment_form_id: '{{#? PAYMENTFORMID}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    notes: '{{#? NOTES}}',
    currency_type: '{{CURRENCYTYPE ? CURRENCYTYPE : 1 }}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_multiple_invoice: '{{#? ISMULTIPLEINVOICE}}',
    internal_transfer_id: '{{#? INTERNALTRANSFERID}}',
    status_receive_money: '{{#? STATUSRECEIVEMONEY}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'payment_slip_id',
        'payment_slip_code',
        'receive_department_id',
        'payer_id',
        'payer_name',
        'total_money',
        'payment_date',
        'expend_type_id',
        'descriptions',
        'company_id',
        'business_id',
        'store_id',
        'payment_type',
        'is_review',
        'payment_status',
        'receiver_type',
        'receiver_id',
        'receiver_name',
        'bank_account_id',
        'is_deposit',
        'is_bookkeeping',
        'accounting_date',
        'payment_form_id',
        'is_active',
        'notes',
        'currency_type',
        'created_user',
        'created_date',
        'is_multiple_invoice',
        'internal_transfer_id',
        'status_receive_money',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'receive_slip_id',
        'receive_slip_code',
        'cashier_id',
        'total_money',
        'payment_date',
        'receive_type_id',
        'descriptions',
        'company_id',
        'business_id',
        'store_id',
        'payment_type',
        'is_review',
        'payment_status',
        'receiver_type',
        'receiver_id',
        'receiver_name',
        'bank_account_id',
        'is_deposit',
        'is_bookkeeping',
        'accounting_date',
        'payment_form_id',
        'is_active',
        'notes',
        'currency_type',
        'created_user',
    ]);
};

const getOptionsExpendType = (data = []) => {
    return transform.transform(data, ['expend_type_id', 'expend_type_name']);
};

const getOptionsPayer = (data = []) => {
    return transform.transform(data, [
        'user_id',
        'user_name',
        'first_name',
        'last_name',
        'department_id',
        'department_name',
    ]);
};

const getCountByDate = (data = []) => {
    return transform.transform(data, ['total']);
};

const getPaymentSlipImage = (data = []) => {
    return transform.transform(data, ['image_url']);
};

const paymentslipPrint = (order) => {
    const transform = new Transform({
        customer_name: '{{#? FULLNAME}}',
        customer_address: '{{#? ADDRESSFULL}}',
        total_money: '{{#? TOTALMONEY}}',
        total_money_text: '{{#? TOTALMONEYTEXT}}',
        print_date: '{{#? PRINTDATE}}',
        note: '{{#? DESCRIPTION}}',
        payment_slip_no: '{{#? PAYMENTSLIPCODE}}',
        company_name: '{{#? COMPANYNAME}}',
        company_address: '{{#? COMPANYADDRESS}}',
        company_phone_number: '{{#? COMPANYPHONENUMBER}}',
        company_email: '{{#? COMPANYEMAIL}}',
        company_fax: '{{#? COMPANYFAX}}',
        company_province_name: '{{#? COMPANYPROVINCENAME}}',
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
    ]);
};

const statistic = (data) => {
    const transform = new Transform({
        total_money: '{{#? TOTALMONEY}}',
        total_money_in_month: '{{#? TOTALMONEYINMONTH}}',
        highest_month: '{{#? HIGHESTMONTH}}',
        total_money_highest_month: '{{#? TOTALMONEYHIGHESTMONTH}}',
        total_money_cash: '{{#? TOTALMONEYCASH}}',
        total_money_transfer: '{{#? TOTALMONEYTRANSFER}}',
        total_money_card: '{{#? TOTALMONEYCARD}}',
    });
    return transform.transform(data, [
        'total_money_in_month',
        'total_money',
        'total_money_highest_month',
        'highest_month',
        'total_money_cash',
        'total_money_transfer',
        'total_money_card',
    ]);
};

const files = (_files) => {
    const transform = new Transform({
        file_id: '{{#? FILEID}}',
        file_module_id: '{{#? FILEMODULEID}}',
        file_url: [
            {
                '{{#if FILEURL}}': `${config.domain_cdn}{{FILEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        file_url: '{{#? FILEURL}}',
        file_ext: '{{#? FILEEXT}}',
        file_mime: '{{#? FILEMIME}}',
        is_delete: '{{ ISDELETE ? 1 : 0}}',
        file_name: '{{#? FILENAME}}',
    });
    return transform.transform(_files, [
        'file_id',
        'file_module_id',
        'file_url',
        'file_url',
        'file_ext',
        'file_mime',
        'is_delete',
        'file_name',
    ]);
};

const expendType = (_d) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        value: '{{#? ID}}',
        name: '{{#? NAME}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(_d, ['id', 'name', 'value', 'label']);
};

const reviewList = (offworkType = []) => {
    const template = {
        review_date: '{{#? REVIEWEDDATE}}',
        review_note: '{{#? REVIEWNOTE}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete_review: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
        is_review: '{{ISREVIEW ? ISREVIEW : 0}}',
        full_name: '{{#? NAME}}',
        review_user: '{{#? REVIEWUSER * 1}}',
        default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        review_level_id: '{{#? REVIEWLEVELID}}',
        review_list_id: '{{#? REVIEWLISTID}}',
    };
    let transform = new Transform(template);
    return transform.transform(offworkType, [
        'review_date',
        'note',
        'is_auto_review',
        'is_review',
        'full_name',
        'review_user',
        'default_picture_url',
        'review_level_name',
        'review_level_id',
        'review_list_id',
        'review_note',
        'is_complete_review',
    ]);
};

const reviewUsers = (users = []) => {
    const template = {
        user_id: '{{#? USERID}}',
        username: '{{#? USERNAME}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        review_level_id: '{{#? REVIEWLEVELID}}',
        id: '{{#? USERNAME * 1}}',
        name: '{{#? FULLNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(users, [
        'user_id',
        'full_name',
        'username',
        'user_name',
        'is_review',
        'review_level_id',
        'id',
        'name',
    ]);
};

const receiverOptions = (options = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        type: '{{#? TYPE}}',
    };
    let transform = new Transform(template);
    return transform.transform(options, ['id', 'name', 'phone_number', 'type']);
};

const listOrder = (orders = [], isDetail = false) => {
    const template = {
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        shipping_id: '{{#? SHIPPINGID}}',
        delivery_code: '{{#? DELIVERYCODE}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        created_date: '{{#? CREATEDDATE}}',
        total_amount: '{{#? TOTALAMOUNT}}',
        shipping_id: '{{#? SHIPPINGID}}',
        debt_collection: '{{#? DEBTCOLLECTION}}',
        shipping_unit_id: '{{#? SHIPPINGUNITID}}',
    };

    let transform = new Transform(template);

    if (isDetail)
        return transform.transform(orders, [
            'order_id',
            'order_no',
            'total_amount',
            'customer_name',
            'debt_collection',
            'receiveslip_order_id',
            'delivery_code',
            'shipping_unit_id',
        ]);
    return transform.transform(orders, [
        'order_id',
        'order_no',
        'created_date',
        'total_amount',
        'customer_name',
        'customer_code',
        'debit_date',
        'debit_detail_id',
        'receiveslip_order_id',
        'delivery_code',
        'shipping_unit_id',
    ]);
};
const file = (file) => {
    return transform.transform(file, ['file_url', 'file_name']);
};

const reviewLevelList = (data = []) => {
    const template = {
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete_review: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        review_level_id: '{{#? REVIEWLEVELID}}',
        review_list_id: '{{#? REVIEWLISTID}}',
        user_review_name: '{{#? FULLNAME}}',
        user_review: '{{#? USERREVIEW * 1}}',
    };
    let transform = new Transform(template);
    return transform.transform(data, [
        'is_auto_review',
        'review_level_name',
        'review_level_id',
        'review_list_id',
        'review_note',
        'is_complete_review',
        'user_review_name',
        'user_review',
    ]);
};

const accountingList = (data) => {
    const transform = new Transform({
        accounting_id: '{{#? ACCOUNTINGID}}',
        debt_account: '{{#? DEBTACCOUNT}}',
        credit_account: '{{#? CREDITACCOUNT}}',
        explain: '{{#? EXPLAIN}}',
        paymentslip_id: '{{#? PAYMENTSLIPID}}',
        money: '{{MONEY ? MONEY : 0}}',
        currency_type: '{{#? CURRENCYTYPE}}',
    });
    return transform.transform(data, [
        'accounting_id',
        'debt_account',
        'credit_account',
        'explain',
        'paymentslip_id',
        'money',
        'currency_type',
    ]);
};

const attachmentList = (data) => {
    const transform = new Transform({
        payment_slip_attachment_id: '{{#? PAYMENTSLIPATTACHMENTID}}',
        attachment_path: '{{#? ATTACHMENTPATH}}',
        attachment_name: '{{#? ATTACHMENTNAME}}',
        payment_slip_id: '{{#? PAYMENTSLIPID}}',
    });
    return transform.transform(data, [
        'payment_slip_attachment_id',
        'attachment_path',
        'attachment_name',
        'payment_slip_id',
    ]);
};

const userReviewList = (data = []) => {
    const template = {
        review_list_id: '{{#? REVIEWLISTID}}',
        review_level_id: '{{#? REVIEWLEVELID}}',
        user_review: '{{#? REVIEWUSER * 1}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        is_review: '{{ISREVIEW}}',
        review_date: '{{#? REVIEWDATE}}',
        payment_slip_id: '{{PAYMENTSLIPID}}',
        is_complete_review: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
    };
    let transform = new Transform(template);
    return transform.transform(data, [
        'review_list_id',
        'review_level_id',
        'user_review',
        'review_date',
        'is_review',
        'payment_slip_id',
        'review_level_name',
        'is_complete_review',
    ]);
};

const invoiceList = (data = []) => {
    const template = {
        invoice_id: '{{#? INVOICEID}}',
        invoice_no: '{{#? INVOICENO}}',
        created_date: '{{#? INVOICECREATEDDATE}}',
        remaining_price: '{{ PAYMENTVALUE ? PAYMENTVALUE : 0}}',
        total_payment_price: '{{ TOTALMONEY ? TOTALMONEY : 0}}',
        invoice_payment_id: '{{#? INVOICEPAYMENTID}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

// const paymentLevelUserList = (data = []) => {
//     const template = {
//         review_level_user_id: '{{#? REVIEWLEVELUSERID}}',
//         review_level_id: '{{#? REVIEWLEVELID}}',
//         expend_type_id: '{{#? EXPENDTYPEID}}',
//         is_complete_review: '{{#? ISCOMPLETEREVIEW}}',
//     };
//     let transform = new Transform(template);
//     return transform.transform(data, ['review_list_id', 'review_level_id', 'review_user', 'payment_slip_id']);
// };

const invoiceOptions = (data = []) => {
    const template = {
        invoice_id: '{{#? INVOICEID}}',
        invoice_no: '{{#? INVOICENO}}',
        created_date: '{{#? CREATEDDATE}}',
        total_payment_price: '{{ TOTALPAYMENTPRICE ? TOTALPAYMENTPRICE : 0}}',
        purchase_order_id: '{{#? PURCHASEORDERID}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    detail,
    list,
    getOptionsExpendType,
    getOptionsPayer,
    getCountByDate,
    getPaymentSlipImage,
    paymentslipPrint,
    statistic,
    files,
    expendType,
    reviewList,
    reviewUsers,
    receiverOptions,
    listOrder,
    reviewLevelList,
    file,
    accountingList,
    attachmentList,
    userReviewList,
    invoiceList,
    // paymentLevelUserList,
    invoiceOptions,
};
