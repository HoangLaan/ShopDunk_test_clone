const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'company_id', 'company_name'
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'company_id', 'company_name'
  ]);
};

module.exports = {
  detail,
  list,
};
