const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'customer_type_id': '{{#? CUSTOMERTYPEID}}',
  'customer_type_name': '{{#? CUSTOMERTYPENAME}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'customer_type_id', 'customer_type_name',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'customer_type_id','customer_type_name',
  ]);
};
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};
module.exports = {
  detail,
  list,
  options,
};
