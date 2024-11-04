const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_customer_type_id': '{{#? PROMOTIONCUSTOMERTYPEID}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'business_id': '{{#? BUSINESSID}}',
  'customer_type_id': '{{#? CUSTOMERTYPEID}}',
  'customer_type_name': '{{#? CUSTOMERTYPENAME}}',
  'customer_type_group_id': '{{#? CUSTOMERTYPEGROUPID}}',
  'customer_type_group_name': '{{#? CUSTOMERTYPEGROUPNAME}}',
  'created_date': '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);
const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_customer_type_id','promotion_id',
    'customer_type_id','customer_type_name','customer_type_group_id','customer_type_group_name','created_date',
  ]);
};

module.exports = {
  list,
};
