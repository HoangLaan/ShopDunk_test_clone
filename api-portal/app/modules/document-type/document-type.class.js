const Transform = require('../../common/helpers/transform.helper');

const template = {
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
  is_required: '{{ ISREQUIRED ? 1 : 0}}',
  document_type_id: "{{#? DOCUMENTTYPEID}}",
  document_type_name: "{{#? DOCUMENTTYPENAME}}",
  description: "{{#? DESCRIPTION}}",
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{ISACTIVE ? 1 : 0}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  company_id: '{{#? COMPANYID}}',
  company_name: '{{#? COMPANYNAME}}',
};

let transform = new Transform(template);

const options = (user) => {
  return transform.transform(user, [
    'id',
    'name',
    'is_required',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    "document_type_id",
    "document_type_name",
    'is_required',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
    'description',
    'company_id',
    'company_name',
    'is_system',
  ]);
};

const detail = (user) => {
  return transform.transform(user, [
    "document_type_id",
    "document_type_name",
    'is_required',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
    'description',
    'company_id',
    'company_name',
    'is_system',
  ]);
};



module.exports = {
  detail,
  list,
  options
};