const Transform = require('../../common/helpers/transform.helper');

const template = {
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'unit_id',
        'unit_name',
        'description',
        'is_active',
        'is_system',
        'created_date',
        'created_user',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'unit_id',
        'unit_name',
        'description',
        'is_active',
        'created_date',
        'created_user',
        'is_deleted',
    ]);
};

module.exports = {
    detail,
    list,
};
