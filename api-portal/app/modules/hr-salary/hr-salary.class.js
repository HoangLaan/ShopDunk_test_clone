const Transform = require('../../common/helpers/transform.helper');

const template = {
    hr_salary_id: '{{#? SALARYID}}',
    hr_salary_name: '{{#? SALARYNAME}}',
    hr_salary_from: '{{#? SALARYFROM}}',
    hr_salary_to: '{{#? SALARYTO}}',

    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0 }}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'hr_salary_id',
        'hr_salary_name',
        'hr_salary_from',
        'hr_salary_to',

        'is_active',
        'created_date',
        'created_user',
        'description',
        'is_system',
    ]);
};

const detail = (data = {}) => {
    return data && Object.keys(data).length > 0
        ? transform.transform(data, [
              'hr_salary_id',
              'hr_salary_name',
              'hr_salary_from',
              'hr_salary_to',

              'is_active',
              'created_date',
              'created_user',
              'description',
              'is_system',
          ])
        : null;
};

module.exports = {
    list,
    detail,
};
