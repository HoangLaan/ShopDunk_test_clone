const Transform = require('../../common/helpers/transform.helper');

const template = {
    receive_slip_id: '{{#? RECEIVESLIPID}}',
    receive_slip_code: '{{#? RECEIVESLIPCODE}}',
    cashier_id: '{{#? CASHIERID}}',
    total_money: '{{#? TOTALMONEY}}',
    payment_date: '{{#? PAYMENTDATE}}',
    receive_type_id: '{{#? RECEIVETYPEID}}',
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
    currency_type: '{{CURRENCYTYPE ? CURRENCYTYPE : 1}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    internal_transfer_id: '{{#? INTERNALTRANSFERID}}',
    status_receive_money: '{{#? STATUSRECEIVEMONEY}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
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
        'created_date',
        'internal_transfer_id',
        'status_receive_money',
    ]);
};

const list = (receiveslips = []) => {
    return transform.transform(receiveslips, [
        'receive_slip_id',
        'receive_slip_code',
        'receive_type_id',
        'receive_type_name',
        'is_active',
        'cashier_name',
        'total_money',
        'order_no',
        'customer_name',
        'payment_date',
        'orders',
        'company_name',
        'business_name',
        'payment_status_name',
        'payment_type_name',
        'is_review',
        'receiver',
    ]);
};

const maxId = (code = []) => {
    return transform.transform(code, ['max_id']);
};

const genReceiveSlipCode = (code = []) => {
    return transform.transform(code, ['receive_slip_code']);
};

const detailToPrint = (receiveslips = []) => {
    return transform.transform(receiveslips, [
        'full_name',
        'company_name',
        'receive_slip_code',
        'total_money',
        'address_full',
        'total_money_text',
        'payment_date',
        'phone_number',
        'descriptions',
    ]);
};

const receiveslipPrint = (order) => {
    const transform = new Transform({
        customer_name: '{{#? FULLNAME}}',
        customer_address: '{{#? ADDRESSFULL}}',
        total_money: '{{#? TOTALMONEY}}',
        total_money_text: '{{#? TOTALMONEYTEXT}}',
        print_date: '{{#? PRINTDATE}}',
        note: '{{#? DESCRIPTIONS}}',
        receiveslip_no: '{{#? RECEIVESLIPCODE}}',
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
        'receiveslip_no',
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
        total_order: '{{#? TOTALORDER}}',
        total_money_cash: '{{#? TOTALMONEYCASH}}',
        total_money_transfer: '{{#? TOTALMONEYTRANSFER}}',
        total_money_card: '{{#? TOTALMONEYCARD}}',
    });
    return transform.transform(data, [
        'total_money_in_month',
        'total_money',
        'total_order',
        'total_money_cash',
        'total_money_transfer',
        'total_money_card',
    ]);
};
const receiveType = (_d) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        value: '{{#? ID}}',
        name: '{{#? NAME}}',
        label: '{{#? NAME}}',
        is_auto_review: '{{ ISAUTOREVIEW ? 1 : 0}}', //ISAPPLYMONTHLY
        is_apply_monthly: '{{ ISAPPLYMONTHLY ? 1 : 0}}',
    });
    return transform.transform(_d, ['id', 'name', 'value', 'label', 'is_auto_review', 'is_apply_monthly']);
};

const options = (users = []) => {
    const template = {
        id: '{{#? ID}}',
        value: '{{#? ID}}',
        name: '{{#? NAME}}',
        label: '{{#? NAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(users, ['id', 'name', 'value', 'label']);
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

const accountingList = (data) => {
    const transform = new Transform({
        accounting_id: '{{#? ACCOUNTINGID}}',
        debt_account: '{{#? DEBTACCOUNT}}',
        credit_account: '{{#? CREDITACCOUNT}}',
        explain: '{{#? EXPLAIN}}',
        receiveslip_id: '{{#? RECEIVESLIPID}}',
        money: '{{MONEY ? MONEY : 0}}',
        currency_type: '{{#? CURRENCYTYPE}}',
    });
    return transform.transform(data, [
        'accounting_id',
        'debt_account',
        'credit_account',
        'explain',
        'receiveslip_id',
        'money',
        'currency_type',
    ]);
};

const attachmentList = (data) => {
    const transform = new Transform({
        receive_slip_attachment_id: '{{#? RECEIVESLIPATTACHMENTID}}',
        attachment_path: '{{#? ATTACHMENTPATH}}',
        attachment_name: '{{#? ATTACHMENTNAME}}',
        receive_slip_id: '{{#? RECEIVESLIPID}}',
    });
    return transform.transform(data, [
        'receive_slip_attachment_id',
        'attachment_path',
        'attachment_name',
        'receive_slip_id',
    ]);
};

module.exports = {
    detail,
    list,
    maxId,
    genReceiveSlipCode,
    detailToPrint,
    receiveslipPrint,
    statistic,
    receiveType,
    options,
    receiverOptions,
    accountingList,
    attachmentList,
};
