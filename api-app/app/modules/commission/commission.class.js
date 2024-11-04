const Transform = require('../../common/helpers/transform.helper');

const template = {
  'order_commission_id': '{{#? ORDERCOMMISSIONID}}',
  'commission_value': '{{#? COMMISSIONVALUE}}',
  'order_date': '{{#? ORDERDATE}}',
  'order_no': '{{#? ORDERNO}}',
  'order_id': '{{#? ORDERID}}',
  'customer_full_name': '{{#? CUSTOMERFULLNAME}}',
  'customer_phone_number': '{{#? CUSTOMERPHONENUMBER}}',
  'customer_email': '{{#? CUSTOMEREMAIL}}',
  'product_id': '{{#? PRODUCTID}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'price': '{{#? PRICE}}',
  'quantity': '{{#? QUANTITY}}',
  'attribute_name': '{{#? ATTRIBUTENAME}}',
  'attribute_values': '{{#? ATTRIBUTEVALUES}}',
  'product_picture': '{{#? PICTUREURL}}',
  'customer_avatar': '{{#? CUSTOMERAVATAR}}',
};

const list = (commission) => {
  let transform = new Transform(template);

  return transform.transform(commission, ['order_commission_id', 'commission_value', 'order_date', 'order_no']);
};

const detail = (commission = {}) => {
  let transform = new Transform(template);

  return transform.transform(commission, ['order_commission_id', 'commission_value', 'order_date', 'order_no', 'order_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_avatar']);
};

const detailProductOrder = (productCommission = {}) => {
  let transform = new Transform(template);

  return transform.transform(productCommission, ['product_id', 'product_name', 'price', 'order_no', 'quantity', 'attribute_name', 'attribute_values', 'product_picture']);
};


module.exports = {
  list,
  detail,
  detailProductOrder,
};
