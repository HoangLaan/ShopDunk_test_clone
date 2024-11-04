const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const list = (products = []) => {
  const template = {
    'id': '{{#? SHOPPROFILEID}}',
    'shop_id': '{{#? SHOPID}}',
    'value': '{{#? SHOPID}}',
    'label': '{{#? SHOPNAME}}',
    'name': '{{#? SHOPNAME}}',
    'shop_name': '{{#? SHOPNAME}}',
    'created_date': '{{#? CREATEDDATECONVERT}}',
    'stock_id': '{{#? STOCKID}}',
    'shop_type': '{{#? SHOPTYPE}}',

    'stocks_code': '{{#? STOCKSCODE}}',
    'stocks_name': '{{#? STOCKSNAME}}',


  };
  let transform = new Transform(template);

  return transform.transform(products, [
    'id',
    'label',
    'name',
    'shop_id',
    'shop_name',
    'value',
    'created_date',
    'stock_id',
    'shop_type',
    'stocks_name',
    'stocks_code'
  ]);
};

const option = (stocks = []) => {
  const templateOption = {
    id: "{{#? STOCKSID}}",
    name: "{{#? STOCKSNAME}}",
    value: "{{#? STOCKSID}}",
    label: "{{#? STOCKSNAME}}",
  };
  let transform = new Transform(templateOption);
  return transform.transform(stocks, ["id", "name", "value", "label"]);
};

module.exports = {
  list,
  option
}
