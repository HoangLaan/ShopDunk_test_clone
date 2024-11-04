const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_company_id': '{{#? PROMOCOMPANYID}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_address_full': '{{#? BUSINESSADDRESSFULL}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
};

let transform = new Transform(template);
const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_company_id','company_id','company_name','business_address_full',
    'promotion_id','business_id','business_name',
  ]);
};

module.exports = {
  list,
};
