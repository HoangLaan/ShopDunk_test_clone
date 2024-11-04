const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    level_id: '{{#? LEVELID}}',
    level_name: '{{#? LEVELNAME }}',
    description: '{{#? DESCRIPTION }}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{#? ISACTIVE ? 1 : 0}}',
    is_system: '{{#? ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',

    skill_id: '{{#? SKILLID}}',
};

const templateOption = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    skill_id: '{{#? SKILLID}}',
};

let transform = new Transform(template);

const items = (products = []) => {
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'level_id',
        'level_name',
        'created_user',
        'created_date',
        'is_deleted',
        'is_active',
        'description',
    ]);
};

const detail = (data) => {
    return transform.transform(data, ['level_id', 'level_name', 'description', 'is_active', 'is_system']);
};

const list = (datas = []) => {
    return transform.transform(datas, [
        'level_id',
        'level_name',
        'description',
        'is_slide',
        'is_active',
        'created_date',
        'created_user',
    ]);
};

const listLocation = (data = []) => {
    let transform = new Transform(templateOption);
    return transform.transform(data, ['id', 'name']);
};
const options = (data = []) => {
    let transform = new Transform(templateOption);
    return transform.transform(data, ['level_id', 'id', 'name']);
};

module.exports = {
    list,
    detail,
    listLocation,
    items,
    options,
};
