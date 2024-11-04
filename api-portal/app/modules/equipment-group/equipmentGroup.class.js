const Transform = require('../../common/helpers/transform.helper');

const template = {
    equipment_group_id: '{{#? EQUIPMENTGROUPID}}',
    equipment_group_name: '{{#? EQUIPMENTGROUPNAME}}',
    equipment_group_code: '{{#? EQUIPMENTGROUPCODE}}',
    parent_name: '{{#? PARENTNAME}}',
    parent_id: '{{#? PARENTID}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    deleted_user: '{{#? DELETEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
};

const defaultFields = [
    'equipment_group_id',
    'equipment_group_name',
    'equipment_group_code',
    'parent_name',
    'parent_id',
    'created_user',
    'created_date',
    'description',
    'is_active',
];

const optionsFields = ['equipment_group_id', 'equipment_group_name'];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const options = (data = []) => {
    return transform.transform(data, optionsFields);
};

module.exports = {
    detail,
    list,
    options,
};
