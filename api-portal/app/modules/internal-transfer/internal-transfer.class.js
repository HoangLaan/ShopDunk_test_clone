const Transform = require('../../common/helpers/transform.helper');

const template = {
    internal_transfer_id: '{{#? INTERNALTRANSFERID}}',
    internal_transfer_name: '{{#? INTERNALTRANSFERNAME}}',
    internal_transfer_code: '{{#? INTERNALTRANSFERCODE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    accounting_date: '{{#? ACCOUNTINGDATE}}',
    created_date: '{{#? CREATEDDATE}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    created_user: '{{#? CREATEDUSER}}',
    review_status: '{{ REVIEWSTATUS ? REVIEWSTATUS : 0}}',
};

const detail = (data = {}) => {
    const templateForReceivePayment = {
        company_receive_id: '{{#? COMPANYRECEIVEID}}',
        business_receive_id: '{{#? BUSINESSRECEIVEID}}',
        store_receive_name: '{{#? STORERECEIVENAME}}',
        company_transfer_id: '{{#? COMPANYTRANSFERID}}',
        business_transfer_id: '{{#? BUSINESSTRANSFERID}}',
        store_transfer_name: '{{#? STORETRANSFERNAME}}',
        is_same_business: '{{ISSAMEBUSSINESS ? 1 : 0}}',
    };
    const templateDetail = {
        ...template,
        internal_transfer_type_id: '{{#? INTERNALTRANSFERTYPEID}}',
        currency_type: '{{#? CURRENCYTYPE}}',
        store_receive_id: '{{#? STORERECEIVEID}}',
        store_transfer_id: '{{#? STORETRANSFERID}}',
        bank_account_receive_id: '{{#? BANKACCOUNTRECEIVEID}}',
        bank_account_transfer_id: '{{#? BANKACCOUNTTRANSFERID}}',
        status_receive_money: '{{STATUSRECEIVEMONEY ? 1 : 0}}',
        ...templateForReceivePayment,
    };
    return new Transform(templateDetail).transform(data, Object.keys(templateDetail));
};

const list = (data = []) => {
    const templateList = {
        ...template,
        store_receive: '{{#? STORERECEIVE}}',
        store_transfer: '{{#? STORETRANSFER}}',
        bank_account_receive: '{{#? BANKACCOUNTRECEIVE}}',
        bank_account_transfer: '{{#? BANKACCOUNTTRANSFER}}',
        review_levels: '{{#? REVIEWLEVELS}}',
        internal_transfer_type_name: '{{#? INTERNALTRANSFERTYPENAME}}',
        review_status_business: '{{#? REVIEWSTATUSBUSINESS}}',
        account: '{{#? ACCOUNT}}',
        total_receive_slip: '{{#? TOTALRECEIVESLIP}}',
        total_payment_slip: '{{#? TOTALPAYMENTSLIP}}',
        status_receive_money: '{{ STATUSRECEIVEMONEY ? 1 : 0}}',
    };
    return new Transform(templateList).transform(data, Object.keys(templateList));
};

const userList = (data = []) => {
    const template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        position_name: '{{#? POSITIONNAME}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const listReviewLevel = (data = []) => {
    const template = {
        review_level_id: '{{#? TIMEKEEPINGTYPEREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        department_id: '{{ DEPARTMENTID ? DEPARTMENTID : 0}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        position_id: '{{ POSITIONID ? POSITIONID : 0}}',
        position_name: '{{#? POSITIONNAME}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const storeOptions = (data = []) => {
    const template = {
        ...templateOptions,
        business_id: '{{#? BUSINESSID}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const bankAccountOptions = (data = []) => {
    return new Transform(templateOptions).transform(data, Object.keys(templateOptions));
};

const internalTransferTypeOptions = (data = []) => {
    return new Transform(templateOptions).transform(data, Object.keys(templateOptions));
};

const templateReviewLevel = {
    user_name_review: '{{#? USERNAMEREVIEW}}',
    full_name_review: '{{#? FULLNAMEREVIEW}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
};

const internalTransferTypeReviewLevel = (data = []) => {
    return new Transform(templateReviewLevel).transform(data, Object.keys(templateReviewLevel));
};

const internalTransferReviewLevel = (data = []) => {
    const template = {
        ...templateReviewLevel,
        review_status: '{{ REVIEWSTATUS ? REVIEWSTATUS : 0}}',
        note: '{{#? NOTE}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const reviewLevel = (data = []) => {
    const template = {
        ...templateReviewLevel,
        review_level_id: '{{#? REVIEWLEVELID}}',
        review_status: '{{ ISREVIEW ? ISREVIEW : 0}}',
        note: '{{#? NOTE}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const accountingList = (data = []) => {
    const template = {
        accounting_id: '{{#? ACCOUNTINGID}}',
        credit_account_id: '{{#? CREDITACCOUNTID}}',
        debt_account_id: '{{#? DEBTACCOUNTID}}',
        explain: '{{#? EXPLAIN}}',
        money: '{{#? MONEY}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const countReviewStatus = (data = []) => {
    const template = {
        review_status: '{{REVIEWSTATUS ? REVIEWSTATUS : 0}}',
        total: '{{#? TOTAL}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const receivePaymentSlipList = (data = []) => {
    const template = {
        slip_id: '{{#? SLIPID }}',
        slip_type: '{{#? SLIPTYPE }}',
        slip_code: '{{#? SLIPCODE}}',
        slip_title: '{{#? SLIPTITLE}}',
        accounting_date: '{{#? ACCOUNTINGDATE}}',
        slip_review_status: '{{ ISREVIEW ? ISREVIEW : 0}}',
        user_doing: '{{#? USERDOING}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const attachmentList = (data) => {
    const template = {
        internal_transfer_id: '{{#? INTERNALTRANSFERID}}',
        attachment_path: '{{#? ATTACHMENTPATH}}',
        attachment_name: '{{#? ATTACHMENTNAME}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    detail,
    list,
    userList,
    listReviewLevel,
    accountingList,
    reviewLevel,
    storeOptions,
    bankAccountOptions,
    internalTransferTypeOptions,
    internalTransferTypeReviewLevel,
    internalTransferReviewLevel,
    countReviewStatus,
    receivePaymentSlipList,
    attachmentList,
};
