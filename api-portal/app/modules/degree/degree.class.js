const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'degree_id': '{{#? DEGREEID}}',
  'degree_name': '{{#? DEGREENAME }}',
  'description': '{{#? DESCRIPTION }}',
  'created_date': '{{#? CREATEDDATE}}',
  'is_active' : '{{#? ISACTIVE ? 1 : 0}}',
  'created_user' :'{{#? CREATEDUSER}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

let transform = new Transform(template);

const items = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'degree_name',
        'degree_id',
        'created_user',
        'created_date',
        'is_deleted',
        'is_active',
        'description',
        
        
    ]);
} 


const detail = (data) => {
  return transform.transform(data, [
    'degree_id','degree_name','description','is_active'
  ]);
};

const list = (datas = []) => {
  return transform.transform(datas, [
    'degree_id','degree_name','description','is_slide','is_active','created_date','created_user'
  ]);
};

const listLocation = (data = []) => {
  let transform = new Transform(templateOption);
  return transform.transform(data, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listLocation,
  items
};
