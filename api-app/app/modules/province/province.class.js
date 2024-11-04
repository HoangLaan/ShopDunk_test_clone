const Transform = require('../../common/helpers/transform.helper');

const template = {
  'province_id': '{{#? PROVINCEID}}',
  'province_name': '{{#? PROVINCENAME}}',
  'keywords': '{{#? KEYWORDS}}',
  'alt_name': '{{#? ALTNAME}}',
  'country_id': '{{#? COUNTRYID}}',
  'priority': '{{#? PRIORITY}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (province = []) => {
  let transform = new Transform(templateOptions);

  return transform.transform(province, ['id', 'name']);
};

const listByStore = (province = []) => {
  const transform = new Transform(template);
  return transform.transform(province, Object.keys(template));
};

module.exports = {
  options,
  listByStore
};
