const Transform = require('../../common/helpers/transform.helper');

const template = {
  'origin_id': '{{#? ORIGINID}}',
  'origin_name': '{{#? ORIGINNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'origin_id', 
    'origin_name', 
    'description',
    'is_active', 
    'created_date', 
    'created_user'
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'origin_id', 
    'origin_name', 
    'is_active', 
    'created_date', 
    'created_user',
    'description',
  ]);
};

module.exports = {
  detail,
  list,
};
