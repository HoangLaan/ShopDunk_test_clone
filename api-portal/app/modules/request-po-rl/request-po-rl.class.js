const Transform = require('../../common/helpers/transform.helper');

const template = {
  'request_po_review_level_id': '{{#? REQUESTPOREVIEWLEVELID}}',
  'review_level_name': '{{#? REVIEWLEVELNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'is_auto_review': '{{ ISAUTOREVIEW ? 1 : 0 }}',
  'created_date': '{{#? CREATEDDATE  }}',
  'created_user': '{{#? CREATEDUSER  }}',
  'is_apply_all_department': '{{ ISAPPLYALLDEPARTMENT ? 1 : 0 }}',
  'is_apply_all_position': '{{ ISAPPLYALLPOSITION ? 1 : 0 }}',
  'company_id': '{{#? COMPANYID}}',
  'business_id': '{{#? BUSINESSID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'description': '{{#? DESCRIPTION}}',
};

let transform = new Transform(template);

const detail = (offworkRL) => {
  return transform.transform(offworkRL, [
    'request_po_review_level_id', 'review_level_name', 'is_active', 'is_system',
    'is_apply_all_department', 'is_apply_all_position', 'company_id', 'business_id', 'description',
  ]);
};

const list = (companys = []) => {
  return transform.transform(companys, [
    'review_level_name', 'is_active', 'is_system', 'is_auto_review', 'created_user', 'created_date', 'company_name', 'request_po_review_level_id', 'business_name',
  ]);
};

const options = (list = []) => {
  const template = {
    'name': '{{#? NAME}}',
    'id': '{{#? ID}}',
    'label': '{{#? NAME}}',
    'value': '{{#? ID}}',
  }
  let transform = new Transform(template);
  return transform.transform(list, [
    'id', 'name', 'label', 'value'
  ]);
};

module.exports = {
  list,
  detail,
  options
};
