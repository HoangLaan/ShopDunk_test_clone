const Transform = require('../../common/helpers/transform.helper');

const template = {
  'company_type_id': '{{#? COMPANYTYPEID}}',
  'company_type_name': '{{#? COMPANYTYPENAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
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
    'company_type_id', 
    'company_type_name', 
    'descriptions', 
    'is_active', 
    'created_date', 
    'created_user',
    'is_system',

  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'company_type_id', 
    'company_type_name', 
    'descriptions', 
    'is_active', 
    'created_date', 
    'created_user',
    'is_system',
    'is_deleted',

  ]);
};

module.exports = {
  detail,
  list,
};
