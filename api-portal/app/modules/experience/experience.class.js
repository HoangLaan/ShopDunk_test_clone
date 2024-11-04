const Transform = require('../../common/helpers/transform.helper');

const template = {
  experience_id: '{{#? EXPERIENCEID}}',
  experience_type: '{{#? EXPERIENCETYPE}}',
  experience_name: '{{#? EXPERIENCENAME}}',
  description: '{{#? DESCRIPTION}}',
  experience_from: '{{#? EXPERIENCEFROM}}',
  experience_to: '{{#? EXPERIENCETO}}',
  order_index: '{{#? ORDERINDEX}}',
  created_user: '{{#? CREATEDUSER}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  is_deleted: '{{ISDELETED ? 1 : 0}}',
  create_date: '{{#? CREATEDDATE}}',
};

const defaultFields = [
  'experience_id',
  'experience_type',
  'experience_name',
  'description',
  'experience_from',
  'experience_to',
  'order_index',
  'created_user',
  'is_active',
  'is_system',
  'is_deleted',
  'create_date',
];

let transform = new Transform(template);

const detail = data => {
  return transform.transform(data, defaultFields);
};

const list = (data = []) => {
  return transform.transform(data, defaultFields);
};

module.exports = {
  detail,
  list,
};



