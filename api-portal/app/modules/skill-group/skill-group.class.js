const Transform = require('../../common/helpers/transform.helper');

const template = {
    'skillgroup_id': '{{#? SKILLGROUPID}}',
    'skillgroup_name': '{{#? SKILLGROUPNAME}}',
    'created_date': '{{#? CREATEDDATE}}',
    'description': '{{#? DESCRIPTION}}',
    'is_active': '{{ISACTIVE ? 1 : 0}}',
    'is_delete': '{{ISDELETED ? 1 : 0}}',
    'is_system': '{{ISSYSTEM ? 1 : 0}}',
    'result': '{{#? RESULT}}',
    'table_used': '{{#? TABLEUSED}}',
    'created_user': '{{#? CREATEDUSER}}',
    'id': '{{#? ID}}',
    'name': '{{#? NAME}}',
};

let transform = new Transform(template);
const detail = (skillgroup) => {
    return transform.transform(skillgroup, [
        'skillgroup_id', 'skillgroup_name', 'created_date',
        'description', 'is_active', 'is_system'
    ]);
};

const list = (skillgroup = []) => {
    return transform.transform(skillgroup, [
        'skillgroup_id', 'skillgroup_name', 'created_date',
        'description', 'is_active', 'is_delete', 'is_system',
        'created_user'
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, [
        'result', 'table_used',
    ]);
};

const options = (skillgroup = []) => {
    return transform.transform(skillgroup, [
        'id', 'name',
    ]);
};

module.exports = {
    list,
    detail,
    detailUsed,
    options
};
