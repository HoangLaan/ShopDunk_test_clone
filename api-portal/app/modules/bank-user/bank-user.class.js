const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        bank_user_id: '{{#? BANKUSERID }}',
        bank_id: '{{#? BANKID }}',
        bank_name: '{{#? BANKNAME }}',
        bank_number: '{{#? BANKNUMBER }}',
        bank_branch: '{{#? BANKBRANCH }}',
        company_id: '{{#? COMPANYID }}',
        company_name: '{{#? COMPANYNAME }}',
        note: '{{#? NOTE }}',
        bank_username: '{{#? BANKUSERNAME }}',
        description: '{{#? DESCRIPTION }}',
        created_date: '{{#? CREATEDDATE }}',
        created_user: '{{#? CREATEDUSER }}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
        is_system: '{{ ISSYSTEM ? 1: 0 }}',
        bank_user_full_name: '{{#? BANKUSERFULLNAME }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
    const _template = {
        bank_user_id: '{{#? BANKUSERID }}',
        bank_id: '{{#? BANKID }}',
        bank_name: '{{#? BANKNAME }}',
        bank_number: '{{#? BANKNUMBER }}',
        bank_branch: '{{#? BANKBRANCH }}',
        bank_username: '{{#? BANKUSERNAME }}',
        company_id: '{{#? COMPANYID }}',
        company_name: '{{#? COMPANYNAME }}',
        note: '{{#? NOTE }}',
        description: '{{#? DESCRIPTION }}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
        bank_user_full_name: '{{#? BANKUSERFULLNAME }}',
        province_id: '{{#? PROVINCEID }}',
        branch_address: '{{#? BRANCHADDRESS }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    getById,
};
