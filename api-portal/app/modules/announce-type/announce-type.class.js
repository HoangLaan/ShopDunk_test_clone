const Transform = require('../../common/helpers/transform.helper');

const template = {
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',

    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
};

let transform = new Transform(template);

const companyOptions = (options = []) => {
    return transform.transform(options, [
        'company_id',
        'company_name',
    ]);
};

const departmentOptions = (options = []) => {
    return transform.transform(options, [
        'department_id',
        'department_name',
    ]);
};

module.exports = {
    companyOptions,
    departmentOptions,
};