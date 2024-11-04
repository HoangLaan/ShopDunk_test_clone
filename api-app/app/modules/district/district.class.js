const Transform = require('../../common/helpers/transform.helper');

const template = {
  'district_id': '{{#? DISTRICTID}}',
  'district_name': '{{#? DISTRICTNAME}}',
  'keywords': '{{#? KEYWORDS}}',
  'province_id': '{{#? PROVINCEID}}',
  'priority': '{{#? PRIORITY}}',
  'is_active': '{{#? ISACTIVE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

const listByStore = (province = []) => {
  const transform = new Transform(template);
  return transform.transform(province, Object.keys(template));
};

module.exports = {
  listByStore
};
