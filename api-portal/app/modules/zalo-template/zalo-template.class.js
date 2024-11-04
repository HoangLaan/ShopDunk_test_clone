const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
  zalo_template_id: '{{#? ZALOTEMPLATEID }}',
  zalo_template_name: '{{#? ZALOTEMPLATENAME }}',
  zalo_template: '{{#? ZALOTEMPLATE }}',
  image_url: '{{#? IMAGEURL }}',
  created_date: '{{#? CREATEDDATE }}',
  created_user: '{{#? CREATEDUSER }}',
  is_active: '{{ ISACTIVE ? 1: 0 }}',
};

const list = (data = []) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  list,
  getById,
};
