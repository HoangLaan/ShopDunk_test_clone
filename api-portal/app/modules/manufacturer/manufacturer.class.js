const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    manufacturer_id: '{{#? MANUFACTURERID}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    manufacturer_address: '{{#? ADDRESS}}',
    manufacturer_code: '{{#? MANUFACTURERCODE}}',
    email: '{{#? EMAIL}}',
    website: '{{#? WEBSITE}}',
    phone_number: '{{#? PHONENUMBER}}',
    descriptions: '{{#? DESCRIPTIONS}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_user_full_name: '{{#? CREATEDUSERFULLNAME}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    representative_name: '{{#? REPRESENTATIVENAME}}',
    alt_name: '{{#? ALTNAME}}',
    province_id: '{{#? PROVINCEID}}',
    ward_id: '{{#? WARDID}}',
    district_id: '{{#? DISTRICTID}}',
    province_name: '{{#? PROVINCENAME}}',
    ward_name: '{{#? WARDNAME}}',
    district_name: '{{#? DISTRICTNAME}}',
    display_name: '{{#? DISPLAYNAME}}',
    representative_position: '{{#? REPRESENTATIVEPOSITION}}',
    representative_phone: '{{#? REPRESENTATIVEPHONENUMBER}}',
    postal_code: '{{#? POSTALCODE}}',
    logo_url: [
        {
            '{{#if LOGOURL}}': `${config.domain_cdn}{{LOGOURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

let transform = new Transform(template);

const options = (manufacturer = []) => {
    return transform.transform(manufacturer, ['id', 'name']);
};

const detail = (manufacturer) => {
    return transform.transform(manufacturer, [
        'manufacturer_code',
        'manufacturer_id',
        'manufacturer_name',
        'manufacturer_address',
        'email',
        'website',
        'phone_number',
        'descriptions',
        'is_active',
        'alt_name',
        'representative_name',
        'province_id',
        'district_id',
        'ward_id',
        'province_name',
        'district_name',
        'ward_name',
        'logo_url',
        'display_name',
        'representative_position',
        'postal_code',
    ]);
};

const list = (manufacturer = []) => {
    return transform.transform(manufacturer, [
        'manufacturer_id',
        'manufacturer_code',
        'manufacturer_name',
        'manufacturer_address',
        'email',
        'website',
        'phone_number',
        'created_user_full_name',
        'is_active',
        'is_deleted',
        'alt_name',
        'representative_name',
        'province_id',
        'district_id',
        'ward_id',
        'province_name',
        'district_name',
        'ward_name',
        'representative_phone'
    ]);
};

module.exports = {
    options,
    detail,
    list,
};
