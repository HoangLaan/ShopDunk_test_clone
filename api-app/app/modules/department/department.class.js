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
};

const templateOptions = {
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
};

const options = (department = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(department, ['department_id', 'department_name']);
};
const detail = department => {
    let transform = new Transform(template);

    return transform.transform(department, [
        'department_id',
        'department_name',
        'company_id',
        'company_name',
        'is_active',
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
    ]);
};

module.exports = {
    options,
    detail,
    priorities,
    list,
};
