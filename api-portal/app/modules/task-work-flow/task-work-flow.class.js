const Transform = require('../../common/helpers/transform.helper');

const template = {
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    work_flow_name: '{{#? WORKFLOWNAME}}',
    work_flow_code: '{{#? WORKFLOWCODE}}',
    description: '{{#? DESCRIPTION}}',
    color: '{{#? COLOR}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    type_purchase: '{{TYPEPURCHASE}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',
};

const defaultFields = [
    'task_work_flow_id',
    'work_flow_name',
    'work_flow_code',
    'color',
    'description',
    'order_index',
    'is_active',
    'is_system',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [...defaultFields, 'type_purchase']);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

module.exports = {
    detail,
    list,
};
