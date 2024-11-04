const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    denominations_id: '{{#? DENOMINATIONSID}}',
    denominations_value: '{{#? DENOMINATIONSVALUE}}',
    description: '{{#? DESCRIPTION}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
};

const list = (list = []) => {
    let transform = new Transform(template);

    return transform.transform(list, ['denominations_id', 'denominations_value', 'description', 'image_url']);
};

module.exports = {
    list,
};
