const Transform = require('../../common/helpers/transform.helper');

const template = {
    'skill_id': '{{#? SKILLID}}',
    'skill_name': '{{#? SKILLNAME}}',
    'created_date': '{{#? CREATEDDATE}}',
    'description': '{{#? DESCRIPTION}}',
    'is_active': '{{ISACTIVE ? 1 : 0}}',
    'is_delete': '{{ISDELETED ? 1 : 0}}',
    'result': '{{#? RESULT}}',
    'table_used': '{{#? TABLEUSED}}',
    'created_user': '{{#? CREATEDUSER}}',
    'is_system': '{{ISSYSTEM ? 1 : 0}}',
    'level_name': '{{#? LEVELNAME}}',
    'level_id': '{{#? LEVELID}}',
    'skillgroup_name': '{{#? SKILLGROUPNAME}}',
    'skillgroup_id': '{{#? SKILLGROUPID}}',
    'name': '{{#? NAME}}',
    'id': '{{#? ID}}',
};

let transform = new Transform(template);
const optionsLevel = (list = []) => {
    const template = {
        'name': '{{#? LEVELNAME}}',
        'id': '{{#? LEVELID}}',
        'label': '{{#? LEVELNAME}}',
        'value': '{{#? LEVELID}}',
    }
    let transform = new Transform(template);
    return transform.transform(list, [
        'id', 'name', 'label', 'value'
    ]);
};

const optionsGroup = (list = []) => {
    const template = {
        'name': '{{#? SKILLGROUPNAME}}',
        'id': '{{#? SKILLGROUPID}}',
        'label': '{{#? SKILLGROUPNAME}}',
        'value': '{{#? SKILLGROUPID}}',
    }
    let transform = new Transform(template);
    return transform.transform(list, [
        'id', 'name', 'label', 'value'
    ]);
};

const detail = (skill) => {
    return transform.transform(skill, [
        'skill_id', 'skill_name', 'created_date',
        'description', 'is_active','is_system'
    ]);
};

const list = (skill = []) => {
    return transform.transform(skill, [
        'skill_id', 'skill_name', 'created_date',
        'description', 'is_active', 'is_delete',
        'is_system', 'created_user'
    ]);
};
const optionskilllevel = (skilllevel = []) => {
    return transform.transform(skilllevel, [
        'level_name', 'level_id', 
    ]);
};
const optionskillgroup = (skillgroup = []) => {
    return transform.transform(skillgroup, [
        'skillgroup_name', 'skillgroup_id', 'skill_id'
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, [
        'result', 'table_used',
    ]);
};

const optionsLevelSkill = (list = []) => {
    return transform.transform(list, [
        'name', 'id', 'skill_id'
    ]);
};

module.exports = {
    list,
    detail,
    detailUsed,
    optionskilllevel,
    optionskillgroup,
    optionsLevel,
    optionsGroup,
    optionsLevelSkill
};
