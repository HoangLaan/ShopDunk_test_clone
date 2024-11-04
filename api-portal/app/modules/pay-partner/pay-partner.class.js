const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    pay_partner_id: '{{#? PAYPARTNERID}}',
    pay_partner_code: '{{#? PAYPARTNERCODE}}',
    pay_partner_full_name: '{{#? PAYPARTNERFULLNAME}}',
    pay_partner_name: '{{#? PAYPARTNERNAME}}',
    name_contact: '{{#? NAMECONTACT}}',
    phone_contact: '{{#? PHONECONTACT}}',
    position_contact: '{{#? POSITIONCONTACT}}',
    email_contact: '{{#? EMAILCONTACT}}',
    refun_day: '{{#? REFUNDAY}}',
    transaction_fee_lc: '{{#? TRANSACTIONFEELC}}',
    fixed_charge_lc: '{{#? FIXEDCHARGELC}}',
    arise_fee_lc: '{{#? ARISEFEELC}}',
    transaction_fee_ic: '{{#? TRANSACTIONFEEIC}}',
    fixed_charge_ic: '{{#? FIXEDCHARGEIC}}',
    arise_fee_ic: '{{#? ARISEFEEIC}}',
    file_name: '{{#? FILENAME}}',
    file_name_path: '{{#? FILENAMEPATH}}',
    logo: '{{#? LOGO}}',
    description: '{{#? DESCRIPTION}}',
    note: '{{#? NOTE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    //
    bank_account_id: '{{#? BANKACCOUNTID}}',
    bank_number: '{{#? BANKNUMBER}}',
    bank_branch: '{{#? BANKBRANCH}}',
    bank_code: '{{#? BANKCODE}}',
    store_name: '{{#? STORENAME}}',
    bank_name: '{{#? BANKNAME}}',
    bank_user_name: '{{#? BANKUSERNAME}}',
    //Api
    pay_partner_api_id: '{{#? PAYPARTNERAPIID}}',
    api_url: '{{#? APIURL}}',
    account: '{{#? ACCOUNT}}',
    password: '{{#? PASSWORD}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
};

const defaultFields = [
    'pay_partner_id',
    'pay_partner_code',
    'logo',
    'created_user',
    'pay_partner_name',
    'pay_partner_full_name',
    'is_active',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'transaction_fee_lc',
        'fixed_charge_lc',
        'arise_fee_lc',
        'transaction_fee_ic',
        'fixed_charge_ic',
        'arise_fee_ic',
        'file_name',
        'file_name_path',
        'email_contact',
        'refun_day',
        'position_contact',
        'phone_contact',
        'name_contact',
        'description',
        'note',
        'is_system',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listStoreBankAccount = (data = []) =>
    transform.transform(data, [
        'bank_account_id',
        'bank_number',
        'bank_branch',
        'bank_code',
        'store_name',
        'bank_name',
        'bank_user_name',
    ]);
const listApi = (data = []) =>
    transform.transform(data, ['pay_partner_api_id', 'api_url', 'account', 'password', 'is_default']);

const options = (data = []) => {
    const template = {
        id: '{{#? PAYPARTNERID}}',
        name: '{{#? PAYPARTNERNAME}}',
        pay_partner_code: '{{#? PAYPARTNERCODE}}',
    };
    const transform = new Transform(template);

    return transform.transform(data, ['id', 'pay_partner_code', 'name']);
};

module.exports = {
    detail,
    list,
    listStoreBankAccount,
    listApi,
    options,
};
