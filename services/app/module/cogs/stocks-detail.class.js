const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const { keysConfigMapping, stringToArray } = require('./utils/helper');

const template = {
  stocks_detail_id: '{{#? STOCKSDETAILID}}',
  cogs_price: '{{#? COGSPRICE}}',
  stocks_id: '{{#? STOCKSID}}',
  stocks_name: '{{#? STOCKSNAME}}',
  description: '{{#? DESCRIPTION}}',
  product_code: '{{#? PRODUCTCODE}}',
  product_name: '{{#? PRODUCTNAME}}',
  product_id: '{{#? PRODUCTID}}',
  product_category_id: '{{#? PRODUCTCATEGORYID}}',
  category_name: '{{#? CATEGORYNAME}}',
  unit_name: '{{#? UNITNAME}}',
  unit_id: '{{#? UNITID}}',
  total_in: '{{#? TOTALIN}}',
  total_out: '{{#? TOTALOUT}}',
  total_inventory: '{{#? TOTALINVENTORY}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  list_product_order: '{{#? LISTPRODUCTORDER}}',
  order_id: '{{#? ORDERID}}',
  order_no: '{{#? ORDERNO}}',
  quantity: '{{QUANTITY ? QUANTITY : 0}}',
  unit_id: '{{#? UNITID}}',
  unit_name: '{{#? UNITNAME}}',
  full_name: '{{#? FULLNAME}}',
  product_imei_code: '{{#? PRODUCTIMEICODE}}',
  net_weight: '{{#? NETWEIGHT}}',
  density: '{{#? DENSITY}}',
  lot_number: '{{#? LOTNUMBER}}',
  stocks_product_holding_id: '{{#? STOCKPRODUCTHOLDINGID}}',
  status_mini_inventory: '{{#? STATUSMINIINVENTORY}}',
  product_type_name: '{{#? PRODUCTTYPENAME}}',
  product_type_id: '{{#? PRODUCTTYPEID}}',
  note: '{{#? NOTE}}',
  stocks_in_request_code: '{{#? STOCKSINREQUESTCODE}}',
  stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
  base_unit_id: '{{#? BASEUNITID}}',
  cost_price: '{{#? COSTPRICE}}',
  supplier_name: '{{#? SUPPLIERNAME}}',
  status_inventory: [
    {
      '{{#if STATUSINVENTORY}}': '{{ STATUSINVENTORY }}',
    },
    {
      '{{#else}}': 0,
    },
  ],
  time_inventory: '{{TIMEINVENTORY ? TIMEINVENTORY : 0}}',
  image_url: [
    {
      '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
    },
    {
      '{{#else}}': null,
    },
  ],
  is_component: '{{ISCOMPONENT? 1 : 0}}',
  is_material: '{{ISMATERIAL? 1 : 0}}',

  component_code: '{{#? COMPONENTCODE}}',
  component_name: '{{#? COMPONENTNAME}}',
  cost_basic_imei_code: '{{#? COSTBASICIMEICODE}}',
  is_over_time_inventory: '{{#? ISOVERTIMEINVENTORY}}',
  stocks_detail_status: '{{#? STOCKSDETAILSTATUS}}',
  stocks_in_date: '{{#? STOCKSINDATE}}',
  product_old_type_id: '{{#? PRODUCTOLDTYPEID}}',
  product_old_type_name: '{{#? PRODUCTOLDTYPENAME}}',
  category_name_global: '{{#? CATEGORYNAMEGLOBAL}}',
  category_id_global: '{{#? CATEGORYIDGLOBAL}}',
  business_id: '{{#? BUSINESSID}}',
  business_name: '{{#? BUSINESSNAME}}',
  type_item: '{{#? ITEMTYPE}}',
  store_name: '{{#? STORENAME}}',
};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    // 'stocks_detail_id',
    'cogs_price',
    'stocks_id',
    'stocks_name',
    'created_date',
    'created_user',
    'description',
    'product_code',
    'product_name',
    'product_id',
    'product_category_id',
    'category_name',
    'unit_name',
    'unit_id',
    'total_in',
    'total_out',
    'lot_number',
    'status_mini_inventory',
    'supplier_name',
    'total_inventory',
    'status_inventory',
    'is_component',
    'category_name_global',
    'category_id_global',
    'business_name',
    'business_id',
    'type_item',
    'store_name',
    'is_material',
  ]);
};

const detail = (user) => {
  return transform.transform(user, [
    'stocks_detail_id',
    'stocks_id',
    'stocks_name',
    'created_date',
    'created_user',
    'description',
    'product_code',
    'product_name',
    'product_id',
    'product_category_id',
    'category_name',
    'unit_name',
    'unit_id',
    'list_product_order',
    'is_component',
    'is_material',
  ]);
};

const listCategory = (areas = []) => {
  return transform.transform(areas, [
    'order_id',
    'order_no',
    'stocks_product_holding_id',
    'product_id',
    'product_code',
    'product_name',
    'lot_number',
    'product_imei_code',
    'quantity',
    'unit_id',
    'unit_name',
    'full_name',
    'created_date',
  ]);
};

const listProductImeiCode = (users = []) => {
  return transform.transform(users, [
    'stocks_detail_id',
    'stocks_id',
    'stocks_name',
    'description',
    'product_code',
    'product_name',
    'product_id',
    'quantity',
    'product_imei_code',
    'total_inventory',
    'lot_number',
    'supplier_name',
    'created_date',
    'full_name',
    'unit_name',
    'unit_id',
    'note',
    'total_in',
    'total_out',
    'total_inventory',
    'stocks_in_request_code',
    'stocks_in_request_id',
    'base_unit_id',
    'cost_price',
    'time_inventory',
    'image_url',
    'cost_basic_imei_code',
    'is_over_time_inventory',
    'order_no',
    'order_id',
  ]);
};

const listUnit = (product) => {
  let transform = new Transform(template);
  return transform.transform(product, ['unit_id', 'unit_name']);
};

const listProductImeiStocksOut = (users = []) => {
  return transform.transform(users, [
    'stocks_detail_id',
    'stocks_id',
    'stocks_name',
    'created_date',
    'created_user',
    'description',
    'product_code',
    'product_name',
    'product_id',
    'product_category_id',
    'category_name',
    'unit_name',
    'unit_id',
    'total_in',
    'total_out',
    'lot_number',
    'product_imei_code',
    'manufacturer_name',
    'net_weight',
    'quantity',
  ]);
};

const listStocksInDensity = (unit) => {
  let transform = new Transform({
    sub_unit_id: '{{#? SUBUNITID}}',
    sub_unit_name: '{{#? SUBUNITNAME}}',
    main_unit_id: '{{#? MAINUNITID}}',
    main_unit_name: '{{#? MAINUNITNAME}}',
    density_value: '{{ DENSITYVALUE ? DENSITYVALUE : 0}}',
  });
  return transform.transform(unit, ['sub_unit_id', 'sub_unit_name', 'main_unit_id', 'main_unit_name', 'density_value']);
};
const listUser = (user = []) => {
  let transform = new Transform({
    id: '{{#? USERNAME}}',
    name: '{{#? FULLNAME}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
  });
  return transform.transform(user, ['id', 'name', 'user_name', 'full_name']);
};

const productImeiCode = (users = []) => {
  return transform.transform(users, [
    'stocks_detail_id',
    'stocks_id',
    'stocks_name',
    'product_code',
    'product_name',
    'product_id',
    'quantity',
    'product_imei_code',
    'total_inventory',
    'lot_number',
    'supplier_name',
    'created_date',
    'full_name',
    'total_inventory',
    'base_unit_id',
    'cost_price',
    'time_inventory',
    'image_url',
    'cost_basic_imei_code',
    'note',
    'is_over_time_inventory',
    'stocks_detail_status',
    'order_no',
    'order_id',
  ]);
};

const listRequest = (user = []) => {
  let transform = new Transform({
    stocks_id: '{{#? STOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    stocks_request_id: '{{#? STOCKSREQUESTID}}',
    stocks_type_name: '{{#? STOCKSTYPENAME}}',
    full_name: '{{#? FULLNAME}}',
    stocks_request_code: '{{#? STOCKSREQUESTCODE}}',
    created_date: '{{#? CREATEDDATE}}',
    is_import: '{{#? ISIMPORT}}',
  });
  return transform.transform(user, [
    'stocks_id',
    'stocks_name',
    'product_imei_code',
    'full_name',
    'stocks_request_id',
    'stocks_type_name',
    'stocks_request_code',
    'created_date',
    'is_import',
  ]);
};
const productOptions = (unit = []) => {
  let transform = new Transform({
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    is_material: '{{ISMATERIAL ? 1 : 0}}',
  });
  return transform.transform(unit, ['id', 'name', 'product_code', 'product_name', 'is_material']);
};

const productsImei = (unit = []) => {
  return transform.transform(unit, [
    'product_id',
    'product_code',
    'product_name',
    'stocks_id',
    'stocks_name',
    'unit_name',
    'unit_id',
    'product_category_id',
    'category_name',
    'cost_price',
    'cost_basic_imei_code',
    'product_imei_code',
    'stocks_in_date',
    'product_old_type_id',
    'product_old_type_name',
  ]);
};

const listIMEI = (list = []) => {
  const template = {
    value: '{{#? IMEI}}',
    label: '{{#? IMEI}}',
    imei: '{{#? IMEI}}',
    stock_id: '{{#? STOCKSID}}',
  };
  let transform = new Transform(template);
  return transform.transform(list, Object.keys(template));
};

const stocksList = (user = []) => {
  let transform = new Transform({
    stocks_id: '{{#? STOCKSID}}',
    stock_type_id: '{{#? STOCKTYPEID}}',
  });
  return transform.transform(user, ['stocks_id']);
};

const stocksIn = (data = []) => {
  let transform = new Transform({
    stocks_id: '{{#? STOCKSID}}',
    product_id: '{{#? PRODUCTID}}',
    total_price_cost: '{{#? TOTALPRICECOST}}',
    total_in: '{{TOTALIN ? TOTALIN : 0}}',
  });
  return transform.transform(data, ['stocks_id', 'product_id', 'total_price_cost', 'total_in']);
};

const stocksOut = (data = []) => {
  let transform = new Transform({
    product_id: '{{#? PRODUCTID}}',
    stocks_id: '{{#? FROMSTOCKSID}}',
    total_price: '{{#? TOTALPRICE}}',
    total_out: '{{ TOTALOUT ? TOTALOUT : 0}}',
  });
  return transform.transform(data, ['product_id', 'stocks_id', 'total_price', 'total_out']);
};

const cogs = (data = []) => {
  let transform = new Transform({
    product_id: '{{#? PRODUCTID}}',
    stocks_id: '{{#? STOCKSID}}',
    cogs_price: '{{ COGSPRICE ? COGSPRICE : 0}}',
  });
  return transform.transform(data, ['product_id', 'stocks_id', 'cogs_price']);
};

const product = (data = []) => {
  const template = {
    product_id: '{{#? PRODUCTID}}',
    stocks_id: '{{#? STOCKSID}}',
  };
  return new Transform(template).transform(data, Object.keys(template));
};

const lastDate = (data = []) => {
  let transform = new Transform({
    last_calculate_date: '{{#? CREATEDDATE}}',
  });
  return transform.transform(data, ['last_calculate_date']);
};

const configsSettings = (list = []) => {
  const data = {};
  let index = 0;
  for (const [keyMapping, keyConfig] of Object.entries(keysConfigMapping)) {
    if (keyConfig === list[index]?.KEYCONFIG) {
      data[keyMapping] = stringToArray(list[index]?.VALUECONFIG);
    }
    index++;
  }
  return data;
};

const stocksOptions = (data = []) => {
  const template = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
  };
  return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
  detail,
  list,
  listCategory,
  listProductImeiCode,
  listUnit,
  listProductImeiStocksOut,
  listStocksInDensity,
  listUser,
  productImeiCode,
  listRequest,
  productOptions,
  productsImei,
  listIMEI,
  stocksList,
  stocksIn,
  stocksOut,
  product,
  cogs,
  lastDate,
  configsSettings,
  stocksOptions,
};
