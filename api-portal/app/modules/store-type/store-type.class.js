const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    store_type_id: '{{#? STORETYPEID}}',
    store_type_name: '{{#? STORETYPENAME}}',
    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    company_name: '{{#? COMPANYNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = obj => {
    return transform.transform(obj, [
        'store_type_id',
        'store_type_name',
        'company_id',
        'business_id',
        'is_active',
        'is_system',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'store_type_id',
        'store_type_name',
        'company_name',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const valueList = (list = []) => {
    let transform = new Transform({
        id: '{{#? VALUE}}',
        value: '{{#? VALUE}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(list, ['id', 'value', 'name']);
};

module.exports = {
    detail,
    list,
    valueList,
};
