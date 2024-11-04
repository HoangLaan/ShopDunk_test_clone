const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    supplier_id: '{{#? SUPPLIERID}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    supplier_code: '{{#? SUPPLIERCODE}}',
    altname: '{{#? ALTNAME}}',
    description: '{{#? DESCRIPTION}}',
    phonenumber: '{{#? PHONENUMBER}}',
    address_full: '{{#? ADDRESSFULL}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    representative_gender: '{{REPRESENTATIVEGENDER ? 1 : 0}}',
    representative_name: '{{#? REPRESENTATIVENAME}}',
    representative_position: '{{#? REPRESENTATIVEPOSITION}}',
    representative_email: '{{#? REPRESENTATIVEEMAIL}}',
    representative_phonenumber: '{{#? REPRESENTATIVEPHONENUMBER}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    address: '{{#? ADDRESS}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    display_name: '{{#? DISPLAYNAME}}',
    postal_code: '{{#? POSTALCODE}}',
    logo_url: [
        {
            '{{#if LOGOURL}}': `${config.domain_cdn}{{LOGOURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],

    supplier_api_id: '{{#? SUPPLIERAPIID}}',
    api_url: '{{#? APIURL}}',
    account: '{{#? ACCOUNT}}',
    password: '{{#? PASSWORD}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    tax_code: '{{#? TAXCODE}}',
    payment_period: '{{#? PAYMENTPERIOD}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'supplier_id',
        'supplier_name',
        'altname',
        'description',
        'address_full',
        'is_active',
        'representative_name',
        'supplier_code',
    ]);
};

const detail = (data) => {
    return transform.transform(data, [
        'supplier_id',
        'supplier_name',
        'altname',
        'description',
        'province_id',
        'district_id',
        'ward_id',
        'address',
        'is_active',
        'is_system',
        'representative_gender',
        'representative_name',
        'representative_position',
        'representative_email',
        'representative_phonenumber',
        'supplier_code',
        'logo_url',
        'display_name',
        'postal_code',
        'tax_code',
        'payment_period',
    ]);
};

const apiDetail = (list) => {
    return transform.transform(list, ['supplier_api_id', 'api_url', 'account', 'password', 'is_default']);
};

const option = (data) => {
    return transform.transform(data, ['id', 'name', 'address_full', 'is_active', 'supplier_code', 'postal_code']);
};

module.exports = {
    list,
    detail,
    option,
    apiDetail,
};
