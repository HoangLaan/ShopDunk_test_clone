const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    payment_form_id: '{{#? PAYMENTFORMID}}',
    payment_form_name: '{{#? PAYMENTFORMNAME}}',
    payment_form_code: '{{#? PAYMENTFORMCODE}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    //Bank
    bank_logo: [
        {
            "{{#if BANKLOGO}}": `${config.domain_cdn}{{BANKLOGO}}`,
        },
        {
            "{{#else}}": undefined,
        },
    ],
    bank_number: '{{#? BANKNUMBER}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    bank_branch: '{{#? BANKBRANCH}}',
    //Paypartner
    pay_partner_full_name: '{{#? PAYPARTNERFULLNAME}}',
    pay_partner_name: '{{#? PAYPARTNERNAME}}',
    pay_partner_id: '{{#? PAYPARTNERID}}',
    logo: [
        {
            "{{#if LOGO}}": `${config.domain_cdn}{{LOGO}}`,
        },
        {
            "{{#else}}": undefined,
        },
    ],
    bank_id: '{{#? BANKID}}',
    bank_name: '{{#? BANKNAME}}',
    key_config: '{{#? KEYCONFIG}}',
    value_config: '{{#? VALUECONFIG}}',


};
let transform = new Transform(template);
const list = (data = []) => {
    return transform.transform(data, [
        'payment_form_id',
        'payment_form_name',
        'payment_form_code',
        'payment_type',
        'pay_partner_id',
    ]);
};

const paymentForm = (data = []) =>{
return transform.transform(data, [
    'key_config',
    'value_config'
]);
}

const listBank = (data = []) => transform.transform(data, ['bank_logo', 'bank_number', 'bank_account_name', 'bank_branch', 'bank_id', 'bank_name'])

const listPayPartner = (data = []) => transform.transform(data, ['pay_partner_full_name', 'pay_partner_name', 'logo', 'bank_id', 'bank_name'])

module.exports = {
    list,
    listBank,
    listPayPartner,
    paymentForm
};
