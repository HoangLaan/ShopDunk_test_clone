const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    vat_id: '{{#? VATID}}',
    vat_name: '{{#? VATNAME}}',
    desc: '{{#? DESCRIPTION}}',
    value: '{{VALUE}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_delete: '{{ISDELETED ? 1 : 0}}',
};

let transform = new Transform(template);

const list = (vats = []) => {
    return transform.transform(vats, [
        'vat_id',
        'vat_name',
        'desc',
        'value',
        'created_user',
        'created_date',
        'is_active',
        'is_delete',
    ]);
};
const detail = (vat) => {
    return transform.transform(vat, [
        'vat_id',
        'vat_name',
        'desc',
        'value',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
        'is_delete',
    ]);
};
module.exports = {
    list,
    detail,
};