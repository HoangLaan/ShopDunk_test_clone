const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_apply_product_id': '{{#? PROMOTIONAPPLYPRODUCTID}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_id': '{{#? PRODUCTID}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'manufacturer_id': '{{#? MANUFACTURERID}}',
  'manufacturer_name': '{{#? MANUFACTURERNAME}}',
  'model_id': '{{#? MODELID}}',
  'model_name': '{{#? MODELNAME}}',
  'business_id':'{{#? BUSINESSID}}',
};

let transform = new Transform(template);
const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_apply_product_id','promotion_id','product_id',
    'product_code','product_name','manufacturer_id','manufacturer_name', 'model_id','model_name',
  ]);
};
const listBussiness = (business=[]) => {
  return transform.transform(business, [
    'business_id',
  ]);
};
module.exports = {
  list,
  listBussiness,
};
