const Transform = require('../../common/helpers/transform.helper');

const template = {
  'budget_review_level_id': '{{#? BUDGETREVIEWLEVELID}}',
  'budget_review_level_name': '{{#? BUDGETREVIEWLEVELNAME}}',
  'company_name': '{{#? COMPANYNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'is_apply_all_department': '{{#? ISAPPLYALLDEPARTMENT}}',
  'is_apply_all_position': '{{#?  ISAPPLYALLPOSITION}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'position_name': '{{#? POSITIONNAME}}',
  'position_id': '{{#? POSITIONID}}',
  'created_date': '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'budget_review_level_id', 'budget_review_level_name', 'company_id',
    'department_id', 'position_id', 'company_name', 'department_name',
    'position_name','created_user','is_apply_all_department','is_apply_all_position'
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
  options
};
