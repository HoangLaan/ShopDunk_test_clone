const Transform = require('../../common/helpers/transform.helper');

const template = {
    brand_id: '{{#? BRANDID}}',
    brand_name: '{{#? BRANDNAME}}',
    brand_code: '{{#? BRANDCODE}}',
    parent_id: '{{#? PARENTID}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_delete: '{{ISDELETED ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',

    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
};

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        'brand_id',
        'brand_name',
        'brand_code',
        'parent_id',
        'description',
        'is_active',
        'is_system',
        'company_id',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'brand_id',
        'brand_name',
        'brand_code',
        'description',
        'is_active',
        'company_name',
        'created_date',
        'created_user',
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, ['result', 'table_used']);
};

const options = (data = []) => {
    return transform.transform(data, ['id', 'name']);
};

module.exports = {
    list,
    detail,
    detailUsed,
    options,
};
