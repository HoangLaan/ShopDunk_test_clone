const Transform = require('../../common/helpers/transform.helper');

const template = {
  'user_group_id': '{{#? USERGROUPID}}',
  'function_id': '{{#? FUNCTIONID}}',
  'function_groupid': '{{#? FUNCTIONGROUPID}}',
  'is_functiongroup': '{{ISFUNCTIONGROUP ? 1 : 0}}',

};
const template2={
  'function_group_id': '{{#? FUNCTIONGROUPID}}',
  'function_group_name': '{{#? FUNCTIONGROUPNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'user_group_id':'{{#? USERGROUPID}}',
  'has_permission':'{{ISFUNCTIONGROUP ? 1 : 0}}',
  'function_id':'{{#? FUNCTIONID}}',
  'function_name':'{{#? FUNCTIONNAME}}',
};
let transform = new Transform(template);
let transform2 = new Transform(template2);

const list = (functionGroups = []) => {
  return transform2.transform(functionGroups, [
    'function_group_id', 'function_group_name', 'description','user_groups',
  ]);
};

const listusergroup = (userGroupFunctions = []) => {
  return transform2.transform(userGroupFunctions, [
    'user_group_id', 'has_permission',
  ]);
};

const listdatausergroup = (userGroupFunctions = []) => {
  return transform2.transform(userGroupFunctions, [
    'user_group_id', 'has_permission','function_id',
  ]);
};

const listfunction = (Functions = []) => {
  return transform2.transform(Functions, [
    'function_id', 'function_name','description','user_groups',
  ]);
};


module.exports = {
  list,
  listusergroup,
  listfunction,
  listdatausergroup,
};
