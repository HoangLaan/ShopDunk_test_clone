const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    block_id: '{{#? BLOCKID}}',
    block_code: '{{#? BLOCKCODE}}',
    block_name: '{{#? BLOCKNAME}}',
    company_id: '{{#? COMPANYID}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',

    company_name: '{{#? COMPANYNAME}}',
    number_of_departments: '{{NUMBEROFDEPARTMENTS ? NUMBEROFDEPARTMENTS : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = obj => {
    return transform.transform(obj, [
        'block_id',
        'block_code',
        'block_name',
        'company_id',
        'description',
        'is_active',
        'is_system',
    ]);
};

const departmentList = (list = []) => {
    return transform.transform(list, ['department_id', 'department_name', 'description']);
};

const list = (list = []) => {
    return transform.transform(list, [
        'block_id',
        'block_code',
        'block_name',
        'company_name',
        'number_of_departments',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

module.exports = {
    detail,
    departmentList,
    list,
};
