const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    material_id: '{{#? MATERIALID}}',
    material_name: '{{#? MATERIALNAME}}',
    material_code: '{{#? MATERIALCODE}}',
    material_group_name: '{{#? MATERIALGROUPNAME}}',
    manufacture_name: '{{#? MANUFACTURERNAME}}',
    number: '{{#? NUMBER}}',
    picture_url: [
        {
            "{{#if PICTUREURL}}": `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            "{{#else}}": undefined,
        },
    ],
};
let transform = new Transform(template);
const list = (data = []) => {
    return transform.transform(data, [
        'material_id',
        'material_name',
        'material_code',
        'material_group_name',
        'manufacture_name',
        'number',
        'picture_url'
    ]);
};


module.exports = {
    list,
};
