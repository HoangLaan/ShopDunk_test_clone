const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');
const template = {
    payment_form_id: '{{#? PAYMENTFORMID}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    payment_form_name: '{{#? PAYMENTFORMNAME}}',
    payment_form_code: '{{#? PAYMENTFORMCODE}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    partner_id: '{{#? PARTNERID}}',
    is_all_business: '{{ ISALLBUSINESS ? 1 : 0}}',
    is_all_store: '{{ ISALLSTORE ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    address: '{{#? ADDRESS}}',
    //Store
    payment_form_store_id: '{{#? PAYMENTFORMSTOREID}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    store_code: '{{#? STORECODE}}',
    store_type_name: '{{#? STORETYPENAME}}',
    //Business
    payment_form_business_id: '{{#? PAYMENTFORMBUSINESSID}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    business_code: '{{#? BUSINESSCODE}}',
    area_name: '{{#? AREANAME}}',
    //Bank
    bank_logo: [
        {
            '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    bank_name: '{{#? BANKNAME}}',
    bank_number: '{{#? BANKNUMBER}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    bank_branch: '{{#? BANKBRANCH}}',
    bank_id: '{{#? BANKID}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    //Paypartner
    pay_partner_full_name: '{{#? PAYPARTNERFULLNAME}}',
    pay_partner_name: '{{#? PAYPARTNERNAME}}',
    pay_partner_logo: [
        {
            '{{#if LOGO}}': `${config.domain_cdn}{{LOGO}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    pay_partner_id: '{{#? PAYPARTNERID}}',
    pay_partner_code: '{{#? PAYPARTNERCODE}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'payment_form_id',
        'company_id',
        'payment_form_name',
        'payment_form_code',
        'payment_type',
        'partner_id',
        'is_all_business',
        'is_all_store',
        'description',
        'is_active',
        'is_active',
        'is_system', //
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'payment_form_code',
        'payment_form_id',
        'payment_form_name',
        'payment_type',
        'company_name',
        'is_all_business',
        'is_all_store',
        'created_date',
        'is_active',
    ]);
};

const listStore = (data = []) =>
    transform.transform(data, [
        'payment_form_store_id',
        'store_id',
        'store_name',
        'payment_form_id',
        'store_code',
        'store_type_name',
        'address',
    ]);
const listBusiness = (data = []) =>
    transform.transform(data, [
        'payment_form_business_id',
        'business_id',
        'business_name',
        'payment_form_id',
        'business_code',
        'area_name',
        'address',
    ]);

const listByStore = (data) =>
    transform.transform(data, [
        'payment_form_id',
        'payment_form_name',
        'payment_type',
        'pay_partner_id',
        'pay_partner_name',
        'pay_partner_full_name',
        'pay_partner_code',
        'pay_partner_logo',
    ]);

const listBank = (data = []) =>
    transform.transform(data, [
        'bank_logo',
        'bank_name',
        'bank_number',
        'bank_account_name',
        'bank_branch',
        'payment_type',
        'bank_id',
        'bank_account_id',
    ]);

const listOption = (data) => {
    const template = {
        value: '{{#? ID }}',
        label: '{{#? NAME }}',
        payment_type: '{{#? PAYMENTTYPE}}',
    };

    let transform = new Transform(template);

    return transform.transform(data, ['value', 'label', 'payment_type']);
};
// const listPayPartner = (data = []) => transform.transform(data,['pay_partner_full_name', 'pay_partner_name','logo'])

module.exports = {
    detail,
    list,
    listStore,
    listBusiness,
    listBank,
    // listPayPartner,
    listByStore,
    listOption,
};
