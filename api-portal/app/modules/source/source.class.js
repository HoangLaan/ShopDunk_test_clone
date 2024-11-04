const Transform = require('../../common/helpers/transform.helper');

const template = {
    source_id: '{{#? SOURCEID}}',
    source_name: '{{#? SOURCENAME}}',
    description: '{{#? DESCRIPTION}}',
    source_type: '{{#? SOURCETYPE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',
};

const defaultFields = [
    'source_id',
    'source_name',
    'description',
    'source_type',
    'is_active',
    'create_date',
    'is_active',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

module.exports = {
    detail,
    list,
};
