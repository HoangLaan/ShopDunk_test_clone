const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    denomination_id: '{{#? DENOMINATIONSID}}',
    denomination_value: '{{#? DENOMINATIONSVALUE}}',
    description: '{{#? DESCRIPTION}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'denomination_id',
        'denomination_value',
        'image_url',
        'description',
        'is_active',
        'is_system',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'denomination_id',
        'denomination_value',
        'image_url',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

module.exports = {
    detail,
    list,
};
