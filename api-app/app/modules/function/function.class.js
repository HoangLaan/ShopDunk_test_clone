const Transform = require('../../common/helpers/transform.helper');

const template = {
  'function_id': '{{#? FUNCTIONID}}',
  'function_name': '{{#? FUNCTIONNAME}}',
  'function_alias': '{{#? FUNCTIONALIAS}}',
  'function_group_id': '{{#? FUNCTIONGROUPID}}',
  'function_group_name': '{{#? FUNCTIONGROUPNAME}}',
  'function_group_is_check': '{{#? FUNCTIONGROUPISCHECK}}',
  'description': '{{#? DESCRIPTION}}',
  'security_level_id': '{{#? SECURITYLEVELID}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'create_date_to': '{{#? CREATEDDATETO}}',
  'create_date_from': '{{#? CREATEDDATEFROM}}',
  
};

let transform = new Transform(template);

const detail = (func) => {
  return transform.transform(func, [
    'function_id', 'function_name', 'function_alias', 'function_group_id', 'function_group_is_check', 'description', 'is_active', 'is_system',
  ]);
};

const list = (funcs = []) => {
  return transform.transform(funcs, [
    'function_id', 'function_name', 'function_alias', 'function_group_id', 'function_group_is_check', 'description', 'is_active', 'is_system',
    'function_group_name','created_date',
  ]);
};

const options = (funcs = []) => {
  return transform.transform(funcs, [
    'function_id', 'function_alias',
  ]);
};

module.exports = {
  detail,
  list,
  options,
};
