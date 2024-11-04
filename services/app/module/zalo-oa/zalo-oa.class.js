const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
  zalo_oa_template_id: '{{#? ZALOOATEMPLATEID }}',
  template_id: '{{#? TEMPLATEID }}',
  content: '{{#? CONTENT }}',
  zalo_oa_id: '{{#? ZALOOAID }}',
  feature_key: '{{#? FEATUREKEY }}',
  brand_id: '{{#? BRANDID }}',
  params: '{{#? PARAMS }}',
  x_client_id: '{{#? XCLIENTID }}',
};

const orderTemplate = {
  // order_id: '{{#? ORDERID }}',
  bill_id: '{{#? ORDERNO }}',
  date: '{{#? ORDERDATE }}',
  // product_id: '{{#? PRODUCTID }}',
  product_name: '{{#? PRODUCTNAME }}'
};

const list = (data = []) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getOrderByMember = (data = []) => {
  const _template = orderTemplate;
  return new Transform(_template).transform(data, Object.keys(_template))
}

module.exports = {
  list,
  getById,
  getOrderByMember
};
