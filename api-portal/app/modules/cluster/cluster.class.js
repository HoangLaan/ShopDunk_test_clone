const Transform = require('../../common/helpers/transform.helper');

const template = {
    cluster_id: '{{#? CLUSTERID}}',
    cluster_name: '{{#? CLUSTERNAME}}',
    cluster_code: '{{#? CLUSTERCODE}}',
    description: '{{#? DESCRIPTION}}',
    business_id: '{{#? BUSINESSID}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    // store
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    store_code: '{{#? STORECODE}}',
    address: '{{#? ADDRESS}}',
};

const defaultFields = [
    'cluster_id',
    'cluster_name',
    'cluster_code',
    'description',
    'business_id',
    'is_active',
    'is_system',
    'create_date',
];

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listStore = (data = []) => {
    return transform.transform(data, ['store_id', 'store_name', 'store_code', 'address']);
};

module.exports = {
    detail,
    list,
    listStore,
};
