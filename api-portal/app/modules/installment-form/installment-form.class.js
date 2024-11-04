const Transform = require('../../common/helpers/transform.helper');

const template = {
    installment_form_id: '{{#? INSTALLMENTFORMID }}',
    installment_form_name: '{{#? INSTALLMENTFORMNAME }}',
    installment_partner_id: '{{#? INSTALLMENTPARTNERID}}',
    installment_partner_period_id: '{{#? INSTALLMENTPARTNERPERIODID}}',
    interest_rate: '{{#? INTERESTRATE}}',
    payer: '{{#? PAYER}}',
    min_prepay: '{{#? MINPREPAY}}',
    is_credit_card: '{{ISCREDITCARD ? 1 : 0 }}',
    is_finance_company: '{{ISFINANCECOMPANY ? 1 : 0}}',
    installment_partner_name: '{{#? INSTALLMENTPARTNERNAME}}',
    installment_partner_logo: '{{#? INSTALLMENTPARTNERLOGO}}',
    total_money_from: '{{#? TOTALMONEYFROM}}',
    total_money_to: '{{#? TOTALMONEYTO}}',
    is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
    is_apply_product: '{{ISAPPLYPRODUCT ? 1 : 0}}',
    is_apply_all_category: '{{ISAPPLYALLCATEGORY ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'installment_form_id',
        'installment_form_name',
        'installment_partner_id',
        'installment_partner_period_id',
        'interest_rate',
        'payer',
        'min_prepay',
        'is_credit_card',
        'is_finance_company',
        'installment_partner_name',
        'installment_partner_logo',
        'is_apply_order',
        'is_apply_product',
        'total_money_from',
        'total_money_to',
        'is_apply_all_category',
        'description',
        'is_active',
        'is_system',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'installment_form_id',
        'installment_form_name',
        'installment_partner_id',
        'is_credit_card',
        'is_finance_company',
        'installment_partner_name',
        'installment_partner_logo',
        'description',
        'created_user',
        'created_date',
        'is_active',

    ]);
};

const categoryList = (data = []) => {
    const template = {
        category_id: '{{#? CATEGORYID }}',
        installment_form_id: '{{#? INSTALLMENTFORMID }}',
        category_name: '{{#? CATEGORYNAME }}',
        parent_name: '{{#? PARENTNAME }}',
    };
    let transform = new Transform(template);
    return transform.transform(data, ['category_id', 'installment_form_id', 'category_name', 'parent_name']);
};

const productList = (data = []) => {
    const template = {
        installment_form_id: '{{#? INSTALLMENTFORMID }}',
        product_id: '{{#? PRODUCTID }}',
        product_name: '{{#? PRODUCTNAME }}',
        product_code: '{{#? PRODUCTCODE }}',
        is_active: '{{#? ISACTIVE }}',
    };
    let transform = new Transform(template);
    return transform.transform(data, [
        'installment_form_id',
        'product_id',
        'product_name',
        'product_code',
        'is_active',
    ]);
};

const option = (data = []) => {
    const template = {
        installment_form_id: '{{#? INSTALLMENTFORMID }}',
        installment_form_name: '{{#? INSTALLMENTFORMNAME }}',
        installment_form_logo: '{{#? INSTALLMENTPARTNERLOGO }}',
        is_apply_all_category: '{{#? ISAPPLYALLCATEGORY }}',
        is_apply_order: '{{#? ISAPPLYORDER }}',
    };
    let transform = new Transform(template);
    return transform.transform(data, [
        'installment_form_id',
        'installment_form_name',
        'installment_form_logo',
        'is_apply_all_category',
        'is_apply_order',
    ]);
};

module.exports = {
    detail,
    list,
    categoryList,
    productList,
    option,
};
