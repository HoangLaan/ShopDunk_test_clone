const Transform = require('../../common/helpers/transform.helper');

const template = {
    position_level_id: '{{#? POSITIONLEVELID}}',
    position_level_name: '{{#? POSITIONLEVELNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    description: '{{#? DESCRIPTION}}',
    is_system: '{{ISSYSTEM ? 1 : 0 }}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    position_id: '{{#? POSITIONID}}',
};

const transform = new Transform(template);

const fieldsDefault = ['position_level_id', 'position_level_name', 'is_active', 'description', 'is_system'];

const list = (data = []) => {
    return transform.transform(data, [...fieldsDefault, 'created_date', 'created_user']);
};

const detail = (area) => {
    return transform.transform(area, fieldsDefault);
};

const options = (list = []) => {
    return transform.transform(list, ['id', 'name', 'position_id', 'department_id']);
};

module.exports = {
    list,
    options,
    detail,
};
