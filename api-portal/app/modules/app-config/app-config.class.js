const Transform = require('../../common/helpers/transform.helper');

const template = {
  'is_active': '{{#? ISACTIVE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'total' : '{{#? TOTAL}}',
  'id_config' : '{{#? IDCONFIG}}',
  'key_config' : '{{#? KEYCONFIG}}',
  'value_config' : '{{#? VALUECONFIG}}',
  'description' : '{{#? DESCRIPTION}}',
  'config_id': '{{#? IDCONFIG}}',
  'config_key': '{{#? KEYCONFIG}}',
  'config_value': '{{#? VALUECONFIG}}',
  'data_type': '{{#? DATATYPE}}',
  'config_type': '{{#? CONFIGTYPE}}',

};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'is_active', 
    'created_date', 
    'created_user', 
    'is_deleted',
    'description',
    'id_config',
    'key_config',
    'value_config',
  ]);
};



const detail = (data) => {
  return transform.transform(data, [
    'is_active', 
    'created_date', 
    'created_user', 
    'is_deleted',
    'description',
    'id_config',
    'key_config',
    'value_config',
  ]);
};


const getOptionsExpendType = (data = []) => {
  return transform.transform(data, [
    'expend_type_id',
    'expend_type_name',
  ]);
};

const getOptionsPayer = (data = []) => {
  return transform.transform(data, [
    'user_id',
    'user_name',
    'first_name',
    'last_name',
    'department_id',
    'department_name'
  ]);
};

const getCountByDate = (data = []) => {
  return transform.transform(data, [
    'total',
  ]);
};

const getPaymentSlipImage = (data = []) => {
  return transform.transform(data, [
    'image_url',
  ]);
};

const getByKey = (data = []) => {
  return transform.transform(data, [
    'key_config',
    'value_config'
  ])
}

const listPageSetting = (data = []) => {
  return transform.transform(data, [
    'config_id','config_key','config_value','data_type', 'config_type',
  ]);
};



module.exports = {
  detail,
  list,
  getOptionsExpendType,
  getOptionsPayer,
  getCountByDate,
  getPaymentSlipImage,
  getByKey,
  listPageSetting,
};

