const Transform = require('../helpers/transform.helper');

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id':'{{#? PARENTID}}',
  'order_index':'{{#? ORDERINDEX}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','parent_id', 'order_index']);
};

module.exports = {
  options,
};
