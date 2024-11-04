const Transform = require('../../common/helpers/transform.helper');

const template = {
  borrow_type_id: '{{#? BORROWTYPEID}}',
  borrow_type_name: '{{#? BORROWTYPENAME}}',
  description: '{{#? DESCRIPTION}}',
  is_for_sale: '{{ ISFORSALE  ? 1 : 0}}',
  is_borrow_partner: '{{ ISBORROWPARTNER  ? 1 : 0}}',
  is_other: '{{ ISOTHER  ? 1 : 0}}',
  is_auto_review: '{{ISAUTOREVIEW  ? 1 : 0 }}',
  created_user: '{{#? CREATEDUSER}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  created_date: '{{#? CREATEDDATE}}',
};

const templateBudgetReviewlv = {
  borrow_review_level_id: '{{#? BORROWREVIEWLEVELID}}',
  borrow_type_id: '{{#? BORROWTYPEID}}',
  is_auto_review: '{{ISAUTOREVIEW  ? 1 : 0 }}',
  is_complete_review: '{{#? ISCOMPLETE}}',
  user: '{{#? USERREVIEW}}',
  borrow_level_from: '{{#? BORROWLEVELFROM}}',
  borrow_level_to: '{{#? BORROWLEVELTO}}',
};

const defaultFields = [
  'borrow_type_id',
  'borrow_type_name',
  "is_for_sale",
  'is_borrow_partner',
  'is_other',
  'description',
  'created_user',
  'is_active',
  'is_system',
  'created_date',
];
const detailFields = [
  'borrow_type_id',
  'borrow_type_name',
  'is_auto_review',
  "is_for_sale",
  'is_borrow_partner',
  'is_other',
  'description',
  'created_user',
  'is_active',
  'is_system',
  'created_date',
];

const reviewLevelFields = [
  'borrow_review_level_id',
  'borrow_type_id',
  'is_auto_review',
  'is_complete_review',
  'user',
  'borrow_level_from',
  'borrow_level_to',

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



