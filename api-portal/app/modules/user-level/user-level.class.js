const Transform = require('../../common/helpers/transform.helper');

const template = {
  'user_level_id': '{{#? USERLEVELID}}',
  'user_level_name': '{{#? USERLEVELNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'description' : '{{#? DESCRIPTION}}',
  'is_system': '{{ISSYSTEM ? 1 : 0 }}'
};

let transform = new Transform(template);

const list = (data = []) => {
  return transform.transform(data, [
    'user_level_id', 
    'user_level_name', 
    'is_active', 
    'created_date', 
    'created_user', 
    'description',
    'is_system'
  ]);
};

module.exports = {
  list,
};
