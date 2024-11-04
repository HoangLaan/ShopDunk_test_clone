const Transform = require('../../common/helpers/transform.helper');

const template = {
    relationshipmember_id: '{{#? RELATIONSHIPMEMBERID}}',
    relationship_name: '{{#? RELATIONSHIPNAME}}',
    decription: '{{#? DECRIPTION}}',
    is_system: '{{#? ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_deleted: '{{#? ISDELETED ? 1 : 0}}',
};

const defaultFields = [
    'relationshipmember_id',
    'relationship_name',
    'decription',
    'created_user',
    'created_date',
    'is_system',
    'is_deleted',
    'create_date',
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
