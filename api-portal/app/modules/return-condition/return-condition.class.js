const Transform = require('../../common/helpers/transform.helper');

const template = {
    returnCondition_id: '{{#? RETURNCONDITIONID}}',
    returnCondition_name: '{{#? RETURNCONDITIONNAME}}',
    description: '{{#? DESCRIPTION}}',
    is_return: '{{ISRETURN ? 1 : 0}}',
    is_exchange: '{{ISEXCHANGE ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_lostBox: '{{ISLOSTBOX ? 1 : 0}}',
    value_lostBox: '{{#? VALUELOSTBOX}}',
    is_lostAccessories: '{{ISLOSTACCESSORIES ? 1 : 0}}',
    value_lostAccessories: '{{#? VALUELOSTACCESSORIES}}',
};

const defaultFields = [
    'returnCondition_id',
    'returnCondition_name',
    'description',
    'is_return',
    'is_exchange',
    'is_active',
    'is_system',
    'created_user',
    'created_date',
    'updated_user',
    'updated_date',
    'is_lostBox',
    'value_lostBox',
    'is_lostAccessories',
    'value_lostAccessories',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

module.exports = {
    detail,
    list,
};
