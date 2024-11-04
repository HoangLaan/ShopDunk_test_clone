const Transform = require('../../common/helpers/transform.helper');

const template = {
  'function_group_id': '{{#? FUNCTIONGROUPID}}',
  'is_function_group': '{{ISFUNCTIONGROUP}}',
  'function_ids': '{{#? FUNCTION_IDS.split("|")}}',
};

let transform = new Transform(template);

const list = (userGroupFunctions = []) => {
  return transform.transform(userGroupFunctions, [
    'function_group_id', 'is_function_group', 'function_ids',
  ]);
};

module.exports = {
  list,
};
