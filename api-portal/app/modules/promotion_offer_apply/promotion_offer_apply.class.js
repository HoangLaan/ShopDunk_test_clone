const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_offer_apply_id': '{{#? PROMOTIONOFFERAPPLYID}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'promotion_offer_id': '{{#? PROMOTIONOFFERID}}',
  'promotion_offer_name': '{{#? PROMOTIONOFFERNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'discount_value': '{{#? DISCOUNTVALUE}}',
  'created_date': '{{#? CREATEDDATE}}',
  'offer': '{{#? OFFER}}',
};

let transform = new Transform(template);
const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_offer_apply_id','promotion_id','offer',
    'promotion_offer_id','promotion_offer_name','business_id','business_name', 'discount_value','created_date',
  ]);
};

module.exports = {
  list,
};
