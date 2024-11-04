const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
    priority: '{{#? PRIORITY}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_interns: '{{ISINTERNS ? 1 : 0}}',
    is_probationarystaff: '{{ ISPROBATIONARYSTAFF ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    position_level_id: '{{#? POSITIONLEVELID}}',
    skill_id: '{{#? SKILLID}}',
    skill_name: '{{#? SKILLNAME}}',
    skill_level_id: '{{#? LEVELID}}',
    level_name: '{{#? LEVELNAME}}',
    hr_level_id: '{{#? USERLEVELID}}',
    hr_level_name: '{{#? LEVELNAME}}',
    experience_id: '{{#? EXPERIENCEID}}',
    salary_id: '{{#? SALARYID}}',
    work_type_id: '{{#? WORKTYPEID}}',
    work_type_name: '{{#? WORKTYPENAME}}',
    is_proffessional: '{{ISPROFESSIONAL ? 1 : 0}}',
    description: '{{DESCRIPTION ? DESCRIPTION : ""}}',
    experience_name: '{{#? EXPERIENCENAME}}',
    salary_name: '{{#? SALARYNAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    is_official: '{{ ISOFFICIAL ? 1 : 0}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    jd_file: '{{#? FILENAME}}',
    file_name: '{{#? FILENAME}}',
    file_path: [
        {
            '{{#if FILEPATH}}': `${config.domain_cdn}{{FILEPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'position_id',
        'position_name',
        'is_active',
        'created_date',
        'created_user',
        'is_system',
        'is_interns',
        'is_probationarystaff',
        'description',
        'jd_file',
        'is_official',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'position_id',
        'position_name',
        'is_active',
        'created_date',
        'created_user',
        'is_system',
    ]);
};

const level = (users = []) => {
    return transform.transform(users, [
        'position_id',
        'position_level_id',
        'experience_id',
        'salary_id',
        'hr_level_id',
        'hr_level_name',
        'experience_name',
        'salary_name',
        'jd_file',
    ]);
};

const skill = (users = []) => {
    return transform.transform(users, [
        'position_id',
        'position_level_id',
        'skill_id',
        'skill_name',
        'skill_level_id',
        'level_name',
    ]);
};

const workType = (users = []) => {
    return transform.transform(users, [
        'position_id',
        'position_level_id',
        'work_type_id',
        'work_type_name',
        'is_proffessional',
        'description',
    ]);
};
const departments = (list = []) => {
    return transform.transform(list, ['position_id', 'department_id', 'department_name']);
};

const options = (list = []) => {
    return transform.transform(list, ['id', 'name']);
};

const file = (obj = {}) => {
    return transform.transform(obj, ['file_name', 'file_path']);
};

module.exports = {
    detail,
    list,
    level,
    skill,
    workType,
    departments,
    options,
    file,
};
