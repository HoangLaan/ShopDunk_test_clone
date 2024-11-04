const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    level_id: '{{#? LEVELID}}',
    level_name: '{{#? LEVELNAME}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_delete: '{{ISDELETED ? 1 : 0}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

let transform = new Transform(template);

const list = (Levels = []) => {
    return transform.transform(Levels, [
        'level_id',
        'level_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};
const detail = Level => {
    return transform.transform(Level, [
        'level_id',
        'level_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

const options = (skillgroup = []) => {
    return transform.transform(skillgroup, ['id', 'name']);
};

module.exports = {
    list,
    detail,
    options,
};
