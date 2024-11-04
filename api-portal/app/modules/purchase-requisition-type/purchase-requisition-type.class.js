const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
    purchase_requisition_type_id: '{{#? PURCHASEREQUISITIONTYPEID }}',
    purchase_requisition_type_name: '{{#? PURCHASEREQUISITIONTYPENAME }}',
    number_of_cancel_date: '{{#? NUMBEROFCANCELDATE }}',
    description: '{{#? DESCRIPTION }}',
    created_date: '{{#? CREATEDDATE }}',
    created_user: '{{#? CREATEDUSER }}',
    is_active: '{{ ISACTIVE ? 1: 0 }}',
    is_returned_goods: '{{ ISRETURNEDGOODS ? 1: 0 }}',
};

const list = (data = []) => {
    const _template = baseTemplate;
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
    const _template = baseTemplate;
    return new Transform(_template).transform(data, Object.keys(_template));
};

const reviewUserList = (data = []) => {
    const _template = {
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        review_level_name: '{{#? PURCHASEREQUISITIONREVIEWLEVELNAME}}',
        user_review: '{{#? USERREVIEW}}',
        full_name: '{{#? FULLNAME}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const accountingList = (data = []) => {
    const _template = {
        type_accounting: '{{#? TYPEACCOUNTING}}',
        accounting_option: '{{#? ACCOUNTINGOPTION}}',
        accounting_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    getById,
    reviewUserList,
    accountingList,
};
