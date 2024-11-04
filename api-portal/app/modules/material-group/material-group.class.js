const Transform = require('../../common/helpers/transform.helper');

const template = {
  material_group_id: '{{#? MATERIALGROUPID}}',
  material_group_name: '{{#? MATERIALGROUPNAME}}',
  material_group_code: '{{#? GROUPCODE}}',
  material_group_parent: '{{#? PARENTID}}',
  description: '{{#? DESCRIPTION}}',
  created_user: '{{#? CREATEDUSER}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  created_date: '{{#? CREATEDDATE}}',
};

const defaultFields = [
  'material_group_id',
  'material_group_name',
  'material_group_parent',
  'material_group_code',
  'description',
  'created_user',
  'is_active',
  'is_system',
  'created_date',
];

const detailFields = [
  'material_group_id',
  'material_group_name',
  'material_group_code',
  'material_group_parent',
  'description',
  'description',
  'is_active',
  'is_system',
];

let transform = new Transform(template);
let transformAttribute = new Transform({value: '{{#? PRODUCTATTRIBUTEID}}'})


const detail = data => {
  return transform.transform(data, detailFields);
};

const list = (data = []) => {
  return transform.transform(data, defaultFields);
};
const detailAttribute = data => {
  return transformAttribute.transform(data, ['value']);
};

const options = (data = []) => {
  let transform = new Transform({
    value: '{{#? ID}}',
    title: '{{#? NAME}}',
    id: '{{#? ID}}',
    pId: '{{PARENTID ? PARENTID : 0}}',
    isLeaf: '{{ISLEAF ? 1 : 0}}',
  });
  return transform.transform(data, ['value', 'title', 'id', 'pId', 'isLeaf']);
};

module.exports = {
  detail,
  list,
  detailAttribute,
  options
};



