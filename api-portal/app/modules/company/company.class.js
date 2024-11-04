const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'company_id': '{{#? COMPANYID}}',
    'company_name': '{{#? COMPANYNAME}}',
    'company_type_id': '{{#? COMPANYTYPEID}}',
    'company_type_name': '{{#? COMPANYTYPENAME}}',
    'phone_number': '{{#? PHONENUMBER}}',
    'address': '{{#? ADDRESS}}',
    'is_active': '{{ISACTIVE ? 1 : 0}}',
    'is_system': '{{ISSYSTEM ? 1 : 0}}',
    'bank_account_id': '{{#? BANKACCOUNTID}}',
    'bank_name': '{{#? BANKNAME}}',
    'open_date': '{{#? OPENDATE}}',
    'email': '{{#? EMAIL}}',
    'fax': '{{#? FAX}}',
    'tax_id': '{{#? TAXID}}',
    'bank_number': '{{#? BANKNUMBER}}',
    'bank_account_name': '{{#? BANKACCOUNTNAME}}',
    'bank_routing': '{{#? BANKROUTING}}',
    'country_id': '{{#? COUNTRYID}}',
    'province_id': '{{#? PROVINCEID}}',
    'district_id': '{{#? DISTRICTID}}',
    'country_name': '{{#? COUNTRYNAME}}',
    'province_name': '{{#? PROVINCENAME}}',
    'district_name': '{{#? DISTRICTNAME}}',
    'ward_id': '{{#? WARDID}}',
    'ward_name': '{{#? WARDNAME}}',
    'address_full': '{{#? ADDRESSFULL}}',
    'result': '{{#? RESULT}}',
    'table_used': '{{#? TABLEUSED}}',
    'exists_name': '{{#? EXISTSNAME}}',
    'exists_phone': '{{#? EXISTSPHONE}}',
    'exists_email': '{{#? EXISTSEMAIL}}',
    'website': '{{#? WEBSITE}}',
    'logo_img': '{{#? LOGOIMG}}',

    // 'bank_account_id': '{{#? BANKACCOUNTID}}',
    'bank_id': '{{#? BANKID}}',
    'bank_number': '{{#? BANKNUMBER}}',
    'bank_branch': '{{#? BANKBRANCH}}',
    'bank_code': '{{#? BANKCODE}}',
    'is_default': '{{ISDEFAULT ? 1 : 0}}',
    'bank_account_name': '{{#? BANKACCOUNTNAME}}',
};

let transform = new Transform(template);

const detail = (company) => {
    return transform.transform(company, [
        'company_id', 'company_name', 'company_type_id', 'open_date', 'phone_number', 'email', 'fax',
        'tax_id', 'bank_account_name', 'bank_name', 'bank_routing', 'website',
        'country_id', 'province_id', 'district_id', 'ward_id', 'country_name', 'province_name', 'district_name', 'ward_name', 'is_active', 'address', 'is_system', 'logo_img'
    ]);
};
const check = (checkExist) => {
    return transform.transform(checkExist, [
        'exists_name', 'exists_phone', 'exists_email',
    ]);
};
const list = (companys = []) => {
    return transform.transform(companys, [
        'company_id', 'company_name', 'company_id', 'company_type_name', 'phone_number', 'email',
        'address_full', 'is_active', 'bank_account_id', 'bank_name', 'company_type_id',
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, [
        'result', 'table_used',
    ]);
};

const templateOptions = {
    'id': '{{#? ID}}',
    'name': '{{#? NAME}}',
};

const options = (userGroups = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(userGroups, ['id', 'name']);
};

const bankAccounts = (company) => {
    return transform.transform(company, [
        'company_id', 'bank_number', 'bank_account_id', 'bank_branch', 'is_default', 'bank_code', 'bank_id', 'bank_account_name'
    ]);
};

const bankAccountOptions = (bankAccounts) => {
    let transform = new Transform({
        'id': '{{#? BANKACCOUNTID}}',
        'name': '{{#? BANKNUMBER}}',
        'logo': [
            {
                "{{#if BANKLOGO}}": `${config.domain_cdn}{{BANKLOGO}}`,
            },
            {
                "{{#else}}": null,
            },
        ],
    });
    return transform.transform(bankAccounts, [
        'id', 'name', 'logo'
    ]);
};

module.exports = {
    list,
    detail,
    detailUsed,
    check,
    options,
    bankAccounts,
    bankAccountOptions
};
