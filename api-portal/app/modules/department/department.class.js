const Transform = require('../../common/helpers/transform.helper');

const template = {
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    company_address_full: '{{#? COMPANYADDRESSFULL}}',
    priority: '{{#? PRIORITY}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    parent_id: '{{#? PARENTID }}',
    parent_name: '{{#? PARENTNAME }}',
    block_id: '{{#? BLOCKID }}',
    desc: '{{#? DESCRIPTION}}',

    user_id: '{{#? ID}}',
    name: '{{#? NAME}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
};

const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const options = (department = []) => {
    let transform = new Transform(templateOptions);

    return transform.transform(department, ['id', 'name']);
};
const detail = department => {
    let transform = new Transform(template);

    return transform.transform(department, [
        'department_id',
        'department_name',
        'company_id',
        'company_name',
        'is_active',
        'parent_id',
        'block_id',
        'desc',
    ]);
};
const priorities = department => {
    let transform = new Transform(template);

    return transform.transform(department, ['department_id', 'department_name', 'prioritiy']);
};

const list = (department = []) => {
    let transform = new Transform(template);

    return transform.transform(department, [
        'department_id',
        'department_name',
        'company_id',
        'company_name',
        'company_address_full',
        'is_active',
        'is_deleted',
        'parent_id',
        'desc',
        'parent_name',
    ]);
};

const listUser = (user = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
    });
    return transform.transform(user, ['id', 'name', 'user_name', 'full_name']);
};

module.exports = {
    options,
    detail,
    priorities,
    list,
    listUser
};
