const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'id': '{{#? ID}}',
    'shop_id': '{{#? SHOPID}}',
    'value': '{{#? SHOPID}}',
    'label': '{{#? SHOPNAME}}',
    'name': '{{#? SHOPNAME}}',
    'shop_name': '{{#? SHOPNAME}}',
    'created_date': '{{#? CREATEDDATECONVERT}}',
    'stock_id': '{{#? STOCKID}}',

};

const list = (products = []) => {
    let transform = new Transform(template);

    return transform.transform(products, [
        'id',
        'label',
        'name',
        'shop_id',
        'shop_name',
        'value',
        'created_date',
        'stock_id'
    ]);
};

const genCustomerCode = (products = []) => {
    const template = {
        'customer_code': '{{#? GEN_CUSTOMER_CODE}}',

    };
    let transform = new Transform(template);
    return transform.transform(products, [
        'customer_code'
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

const productOptions = (stocks = []) => {
    const templateOption = {
        id: "{{#? ID}}",
        name: "{{#? NAME}}",
        value: "{{#? ID}}",
        label: "{{#? NAME}}",
        product_id: "{{#? PRODUCTID}}",
        product_name: "{{#? PRODUCTNAME}}",
    };
    let transform = new Transform(templateOption);
    return transform.transform(stocks, ["id", "name", "value", "label", "product_id", "product_name"]);
};

const detailProduct = (stocks = []) => {
    const templateOption = {
      product_id: "{{#? PRODUCTID}}",
      product_code: "{{#? PRODUCTCODE}}",
      product_name: "{{#? PRODUCTNAME}}",
      category_name: "{{#? CATEGORYNAME}}",
      product_id_lazada: "{{#? PRODUCTIDLAZADA}}",
      total_inventory: "{{TOTALINVENTORY || 0}}",
      picture_url: [
        {
          "{{#if IMAGEURL}}": `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
          "{{#else}}": undefined,
        },
      ],
  
    };
    let transform = new Transform(templateOption);
    return transform.transform(stocks, ["product_id", "product_code", "product_name", "category_name", "product_id_lazada", "total_inventory", "picture_url"]);
  };


const listInventory = (users = []) => {
    const templateOption = {
      stocks_detail_id: "{{#? STOCKSDETAILID}}",
      stocks_id: "{{#? STOCKSID}}",
      stocks_name: "{{#? STOCKSNAME}}",
      description: "{{#? DESCRIPTION}}",
      product_code: "{{#? PRODUCTCODE}}",
      product_name: "{{#? PRODUCTNAME}}",
      product_id: "{{#? PRODUCTID}}",
      product_category_id: "{{#? PRODUCTCATEGORYID}}",
      category_name: "{{#? CATEGORYNAME}}",
      unit_name: "{{#? UNITNAME}}",
      unit_id: "{{#? UNITID}}",
      total_in: "{{#? TOTALIN}}",
      total_out: "{{#? TOTALOUT}}",
      total_inventory: "{{TOTALINVENTORY || 0}}",
      total_holding: "{{#? TOTALHOLDING}}",
      created_user: "{{#? CREATEDUSER}}",
      created_date: "{{#? CREATEDDATE}}",
      updated_user: "{{#? UPDATEDUSER}}",
      updated_date: "{{#? UPDATEDDATE}}",
      deleted_user: "{{#? DELETEDUSER}}",
      deleted_date: "{{#? DELETEDDATE}}",
      list_product_order: "{{#? LISTPRODUCTORDER}}",
      order_id: "{{#? ORDERID}}",
      order_no: "{{#? ORDERNO}}",
      quantity: "{{#? QUANTITY}}",
      unit_id: "{{#? UNITID}}",
      unit_name: "{{#? UNITNAME}}",
      full_name: "{{#? FULLNAME}}",
      product_imei_code: "{{#? PRODUCTIMEICODE}}",
      net_weight: "{{#? NETWEIGHT}}",
      density: "{{#? DENSITY}}",
      lot_number: "{{#? LOTNUMBER}}",
      manufacturer_name: "{{#? MANUFACTURERNAME}}",
      stocks_product_holding_id: "{{#? STOCKPRODUCTHOLDINGID}}",
      status_mini_inventory: "{{#? STATUSMINIINVENTORY}}",
      product_type_name: "{{#? PRODUCTTYPENAME}}",
      product_type_id: "{{#? PRODUCTTYPEID}}",
      note: "{{#? NOTE}}",
      stocks_in_request_code: "{{#? STOCKSINREQUESTCODE}}",
      stocks_in_request_id: "{{#? STOCKSINREQUESTID}}",
      base_unit_id: "{{#? BASEUNITID}}",
      cost_price: "{{#? COSTPRICE}}",
      product_shopee_id: "{{#? PRODUCTIDSHOPEE}}",
      product_lazada_id: "{{#? PRODUCTIDLAZADA}}",
      picture_url: [
        {
          "{{#if IMAGEURL}}": `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
          "{{#else}}": undefined,
        },
      ],
    };
    let transform = new Transform(templateOption);
    return transform.transform(users, [
      // 'stocks_detail_id',
      "stocks_id",
      "stocks_name",
      "created_date",
      "created_user",
      "description",
      "product_code",
      "product_name",
      "product_id",
      "product_category_id",
      "category_name",
      "unit_name",
      "unit_id",
      "total_in",
      "total_out",
      "total_inventory",
      "total_holding",
      "lot_number",
      "status_mini_inventory",
      "product_shopee_id",
      "product_lazada_id",
      "picture_url"
    ]);
  };
// detailProduct

module.exports = {
    list,
    genCustomerCode,
    option,
    productOptions,
    detailProduct,
    listInventory
};

