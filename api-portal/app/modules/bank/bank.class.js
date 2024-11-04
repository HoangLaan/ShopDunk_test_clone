const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    bank_id: '{{#? BANKID}}',
    bank_code: '{{#? BANKCODE}}',
    bank_name: '{{#? BANKNAME}}',
    bank_name_en: '{{#? BANKNAMEEN}}',
    registered_office: '{{#? REGISTEREDOFFICE}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    bank_logo: [
        {
            '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    logo: [
        {
            '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    id: '{{#? BANKID}}',
    name: '{{#? BANKNAME}}',
    code: '{{#? BANKCODE}}',
};

const transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'bank_id',
        'bank_code',
        'bank_name',
        'bank_logo',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const detail = (obj) => {
    return transform.transform(obj, [
        'bank_id',
        'bank_code',
        'bank_name',
        'bank_logo',
        'bank_name_en',
        'registered_office',
        'description',
        'is_active',
        'is_system',
    ]);
};

const options = (data = []) => {
    return transform.transform(data, ['id', 'name', 'logo', 'code']);
};

module.exports = {
    list,
    detail,
    options,
};
