const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const templateRegime = {
  regime_id: '{{#? REGIMEID}}',
  regime_name: '{{#? REGIMENAME}}',
  regime_type_name: '{{#? REGIMECODE}}',
  regime_type_id: '{{#? REGIMETYPEID}}',
  from_date: '{{#? STARTTIME}}',
  to_date: '{{#? ENDTIME}}',
  is_review: '{{ ISREVIEW ? 1 : 0}}',
  is_system: '{{ ISSYSTEM ? 1 : 0}}',
  is_active: '{{ ISACTIVE ? 1 : 0}}',
  created_date: '{{#? CREATEDDATE}}',
  department_name: '{{#? DEPARTMENTNAME}}',
  created_user: '{{#? FULLNAME}}',
  review_info: '{{#? REVIEWINFO}}'
};
let transformRegime = new Transform(templateRegime);

const listRegime = (list = []) => {
  return transformRegime.transform(list, [
    'regime_id',
    'regime_name',
    'regime_type_name',
    'is_review',
    'is_active',
    'is_system',
    'from_date',
    'to_date',
    'review_info',
    'created_date',
    'created_user'
  ]);
};

const detailRegime = (regime = {}) => {
  return transformRegime.transform(regime, [
    'regime_id',
    'regime_name',
    'regime_type_id',
    'from_date',
    'to_date',
    'is_active',
    'is_system',
    'department_name',
    'created_date',
    'created_user'
  ]);
};

const template = {
  regime_review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
  regime_review_level_name: '{{#? REGIMEREVIEWLEVELNAME}}',
  company_id: '{{#? COMPANYID}}',
  users: '{{#? USERS}}'
};

let transform = new Transform(template);

const list = (list = []) => {
  return transform.transform(list, [
    'regime_review_level_id',
    'regime_review_level_name',
    'company_id',
    'users',
  ]);
};

const templateReviewUserAndAttachment = {
  user_id: '{{#? USERID}}',
  username: '{{#? USERNAME}}',
  full_name: '{{#? FULLNAME}}',
  user_review: '{{#? USERREVIEW}}',
  is_review: '{{ ISREVIEW ? 1 : 0}}',
  regime_review_level_name: '{{#? REGIMEREVIEWLEVELNAME}}',
  regime_review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
  attachment_path: [
    {
      "{{#if ATTACHMENTPATH}}": `${config.domain_cdn}{{ATTACHMENTPATH}}`,
    },
    {
      "{{#else}}": null,
    },
  ],
  attachment_name: '{{#? ATTACHMENTNAME}}',
  attachment_id: '{{#? REGIMEATTACHMENTID}}',
};

let transform2 = new Transform(templateReviewUserAndAttachment);

const detailUser = (user = {}) => {
  return transform2.transform(user, [
    'user_id',
    'username',
    'full_name',
  ]);
};

const detailInfoReview = (user = {}) => {
  return transform2.transform(user, [
    'is_review',
    'user_review',
  ]);
};
const detailListInfoReview = (users = []) => {
  return transform2.transform(users, [
    'is_review',
    'user_review',
    'regime_review_level_name',
    'regime_review_level_id'
  ]);
};

const detailAttachment = (listAt = []) => {
  return transform2.transform(listAt, [
    'attachment_path',
    'attachment_name',
    'attachment_id'
  ]);
};


module.exports = {
  listRegime,
  list,
  detailUser,
  detailInfoReview,
  detailRegime,
  detailAttachment,
  detailListInfoReview
};
