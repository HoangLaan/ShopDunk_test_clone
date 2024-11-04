const Transform = require('../../common/helpers/transform.helper');

const template = {
  'function_group_id': '{{#? FUNCTIONGROUPID}}',
  'function_group_name': '{{#? FUNCTIONGROUPNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'order_index': '{{#? ORDERINDEX}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'delete_user': '{{#? DELETEDUSER}}',
};

const defaultFields = ['function_group_id', 'function_group_name', 'description', 'order_index', 'is_active', 'is_system','create_date'];

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
