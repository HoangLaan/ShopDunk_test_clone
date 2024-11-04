const Transform = require('../../common/helpers/transform.helper');

const template = {
  'cost_id': '{{#? COSTID}}',
  'cost_name': '{{#? COSTNAME}}',
  'is_active': '{{ISACTIVE  ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'description': '{{#? DESCRIPTION}}',
  'percent_value': '{{#? PERCENTVALUE}}',
  'is_input_values': '{{ISINPUTVALUES  ? 1 : 0}}',
  'is_percent': '{{ISPERCENT  ? 1 : 0}}',
  'is_discount': '{{ISDISCOUNT  ? 1 : 0}}',
  'is_value_by_time': '{{ISVALUEBYTIME  ? 1 : 0}}',
  'time_type': '{{#? TIMETYPE}}',
  'id': '{{#? COSTID}}',
  'name': '{{#? COSTNAME}}',
};


let transform = new Transform(template);

const options = (costtypes) => {
  return transform.transform(costtypes, [
    'cost_id',
    'cost_name',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
    'description',
    'percent_value',
    'is_input_values',
    'is_percent',
    'is_discount',
    'is_value_by_time',
    'time_type',
    'id',
    'name'
  ]);
};

const list = (costtypes) => {
  return transform.transform(costtypes, [
    'cost_id',
    'cost_name',
    'is_active',
    'created_date',
    'created_user',
  ]);
};

const detail = (costtypes) => {
  return transform.transform(costtypes, [
    'cost_id',
    'cost_name',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
    'description',
    'percent_value',
    'is_input_values',
    'is_percent',
    'is_discount',
    'is_value_by_time',
    'time_type',
  ]);
};

module.exports = {
  options,
  list,
  detail
};
