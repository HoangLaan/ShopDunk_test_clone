const Transform = require('../../common/helpers/transform.helper');

const template = {
  budget_type_id: '{{#? BUDGETTYPEID}}',
  budget_type_name: '{{#? BUDGETTYPENAME}}',
  budget_type_code: '{{#? BUDGETTYPECODE}}',
  company_id: '{{#? COMPANYID}}',
  business_id: '{{#? BUSINESSID}}',
  effective_time: '{{#? EFFECTIVETIME}}',
  description: '{{#? DESCRIPTION}}',
  notes: '{{#? NOTE}}',
  is_auto_review: '{{#? ISAUTOREVIEW}}',
  created_user: '{{#? CREATEDUSER}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  created_date: '{{#? CREATEDDATE}}',
};

const templateBudgetReviewlv = {
  budget_review_level_id: '{{#? BUDGETREVIEWLEVELID}}',
  budget_type_id: '{{#? BUDGETTYPEID}}',
  is_auto_review: '{{#? ISAUTOREVIEW}}',
  is_complete_review: '{{#? ISCOMPLETE}}',
  user: '{{#? USERREVIEW}}',
  budget_level_from: '{{#? BUDGETLEVELFROM}}',
  budget_level_to: '{{#? BUDGETLEVELTO}}',
};

const defaultFields = [
  'budget_type_id',
  'budget_type_name',
  'budget_type_code',
  'effective_time',
  'description',
  'note',
  'created_user',
  'is_active',
  'is_system',
  'created_date',
];
const detailFields = [
  'budget_type_id',
  'budget_type_name',
  'budget_type_code',
  'company_id',
  'business_id',
  'effective_time',
  'is_auto_review',
  'notes',
  'description',
  'created_user',
  'is_active',
  'is_system',
  'created_date',
];

const reviewLevelFields = [
  'budget_review_level_id',
  'budget_type_id',
  'is_auto_review',
  'is_complete_review',
  'user',
  'budget_level_from',
  'budget_level_to',

];
let transform = new Transform(template);
let transformBudgetRvlv = new Transform(templateBudgetReviewlv);

const detail = data => {
  return transform.transform(data, detailFields);
};

const list = (data = []) => {
  return transform.transform(data, defaultFields);
};

const listReviewLevel = (data = []) => {
  return transformBudgetRvlv.transform(data, reviewLevelFields);
};

module.exports = {
  detail,
  list,
  listReviewLevel
};



