const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    business_id: '{{#? BUSINESSID}}',
    business_code: '{{#? BUSINESSCODE}}',
    business_tax_code: '{{#? BUSINESSTAXCODE}}',
    business_name: '{{#? BUSINESSNAME}}',
    business_short_name: '{{#? BUSINESSSHORTNAME}}',
    representative_name: '{{#? REPRESENTATIVENAME}}',
    account_id: '{{#? ACCOUNTID}}',
    misa_username: '{{#? USERNAME}}',
    misa_password: '{{#? PASSWORD}}',
    misa_tax_code: '{{#? TAXCODE}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    area_id: '{{#? AREAID}}',
    area_name: '{{#? AREANAME}}',
    business_type_id: '{{#? BUSINESSTYPEID}}',
    business_type_name: '{{#? BUSINESSTYPENAME}}',
    opening_date: '{{#? OPENINGDATE}}',
    business_phone_number: '{{#? BUSINESSPHONENUMBER}}',
    business_mail: '{{#? BUSINESSEMAIL}}',
    description: '{{#? DESCRIPTION}}',
    country_id: '{{#? COUNTRYID}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    postal_code: '{{#? POSTALCODE}}',
    address: '{{#? ADDRESS}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_business_place: '{{ISBUSINESSPLACE ? 1 : 0}}',

    bank_number: '{{#? BANKNUMBER}}',
    bank_account_business_id: '{{#? BANKACCOUNTBUSINESSID}}',
    bank_branch: '{{#? BANKBRANCH}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    bank_code: '{{#? BANKCODE}}',
    bank_id: '{{#? BANKID}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'business_id',
        'business_code',
        'business_tax_code', //
        'business_name',
        'business_short_name', //
        'representative_name', //
        'company_id',
        'area_id',
        'business_type_id',
        'opening_date',
        'business_phone_number',
        'business_mail',
        'description',
        'country_id',
        'province_id',
        'district_id',
        'ward_id',
        'postal_code',
        'address',
        'is_active',
        'is_system', //
        'is_business_place', //
        'account_id',
        'misa_username',
        'misa_tax_code',
    ]);
};

const bankAccountList = (company) => {
    return transform.transform(company, [
        'company_id',
        'bank_number',
        'bank_account_business_id',
        'bank_branch',
        'is_default',
        'bank_code',
        'bank_id',
        'bank_account_name',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'business_id',
        'business_code',
        'business_name',
        'company_name',
        'business_type_name',
        'opening_date',
        'business_phone_number',
        'business_mail',
        'is_active',
        'area_name',
        'area_id'
    ]);
};

// options
const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const options = (userGroups = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(userGroups, ['id', 'name']);
};

const optionsByAreaList = (business = []) => {
    let transform = new Transform({
        id: '{{#? BUSINESSID}}',
        name: '{{#? BUSINESSNAME}}',
    });
    return transform.transform(business, ['id', 'name']);
};

const optionsV3 = (business = []) => {
    let transform = new Transform({
        id: '{{#? ID*1}}',
        name: '{{#? NAME}}',
        company_id: '{{#? COMPANYID}}',
        area_id: '{{#? AREAID}}',
        is_active: '{{#? ISACTIVE}}',
    });
    return transform.transform(business, ['id', 'name', 'company_id', 'area_id', 'is_active']);
};

module.exports = {
    detail,
    bankAccountList,
    list,
    options,
    optionsByAreaList,
    optionsV3,
};
