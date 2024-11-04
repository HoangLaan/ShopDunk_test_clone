const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_apply_product_category_id': '{{#? PROMOTIONAPPLYPROCATEGORYID}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'product_category_id': '{{#? PRODUCTCATEGORYID}}',
  'parent_name': '{{#? PARENTNAME}}',
  'company_name': '{{#? COMPANYNAME}}'
};

let transform = new Transform(template);
const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_apply_product_category_id','promotion_id','product_category_id',
    'category_name','parent_name','company_name'
  ]);
};

module.exports = {
  list
};
