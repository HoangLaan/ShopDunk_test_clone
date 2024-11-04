const Transform = require('../../common/helpers/transform.helper');

const template = {
    account_id: '{{#? ACCOUNTID}}',
    username: '{{#? USERNAME}}',
    password: '{{#? PASSWORD}}',
    tax_code: '{{#? TAXCODE}}',
    business_id: '{{#? BUSINESSID}}',
    company_id: '{{#? COMPANYID}}',
    is_origin: '{{ISORIGIN ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'account_id',
        'username',
        'password',
        'tax_code',
        'business_id',
        'company_id',
        'is_origin',
    ]);
};
module.exports = {
    detail,
};
