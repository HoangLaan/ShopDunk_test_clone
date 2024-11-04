const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
  purchase_order_division_id: '{{#? PURCHASEORDERDIVISIONID }}',
  purchase_order_id: '{{#? PURCHASEORDERID }}',
  purchase_order_code: '{{#? PURCHASEORDERCODE }}',
  purchase_order_division_name: '{{#? PURCHASEORDERDIVISIONNAME }}',
  purchase_order_division_code: '{{#? PURCHASEORDERDIVISIONCODE }}',
  business_id: '{{#? BUSINESSID }}',
  created_date: '{{#? CREATEDDATE }}',
  created_user: '{{#? CREATEDUSER }}',
  is_active: '{{ ISACTIVE ? 1: 0 }}',
  division_type: '{{DIVISIONTYPE ? DIVISIONTYPE : 0}}',
  stocks_id: '{{#? STOCKSID }}',
  expected_date_all: '{{#? EXPECTEDDATEALL }}',
  business_ids: '{{#? BUSINESSIDS }}',
  is_condition_inventory: '{{#? ISCONDITIONINVENTORY }}',
  is_condition_plans: '{{#? ISCONDITIONPLANS}}',
  is_condition_history: '{{#? ISCONDITIONHISTORY}}',
  stocks_type_list: '{{#? STOCKSTYPELIST }}',
  history_plan_from: '{{#? HISTORYPLANFROM }}',
  history_plan_to: '{{#? HISTORYPLANTO }}',
  // DIVISIONTYPE
};

const list = (data = []) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const areaList = (data = []) => {
  const _template = {
    purchase_order_division_area_id: '{{#? POPURCHASEORDERDIVISIONAREAID }}',
    purchase_order_division_id: '{{#? PURCHASEORDERDIVISIONID }}',
    area_id: '{{#? AREAID }}',
    value: '{{#? AREAID }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const storeApply = (data = []) => {
  const _template = {
    purchase_order_division_detail_id: '{{#? POPURCHASEORDERDIVISIONDETAILID }}',
    purchase_order_id: '{{#? PURCHASEORDERID }}',
    store_id: '{{#? STOREID }}',
    store_name: '{{#? STORENAME }}',
    store_code: '{{#? STORECODE }}',
    product_id: '{{#? PRODUCTID }}',
    quantity: '{{#? QUANTITY }}',
    division_quantity: '{{#? DIVISIONQUANTITY }}',
    stocks_id: '{{#? STOCKSID }}',
    unit_id: '{{#? UNITID }}',
    unit_name: '{{#? UNITNAME }}',
    expected_date: '{{#? EXPECTEDDATE }}',
    note: '{{#? NOTE }}',
    condition_plan: '{{#? PLANVALUE }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const reviewList = (data = []) => {
  const _template = {
    purchase_order_division_review_id: '{{#? PODIVISIONREVIEWLISTID }}',
    purchase_order_division_id: '{{#? PURCHASEORDERDIVISIONID }}',
    review_level_id: '{{#? POREVIEWLEVELID }}',
    review_user: '{{#? REVIEWUSER }}',
    is_completed: '{{ ISCOMPLETED ? 1: 0 }}',
    is_reviewed: '{{ ISREVIEWED ? 1: ISREVIEWED === 0 ? 0 : null }}',
    review_date: '{{#? REVIEWDATE }}',
    note: '{{#? NOTE }}',
    avatar: '{{#? AVATAR }}',
    full_name: '{{#? FULLNAME }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

// review level
const reviewLevelList = (data = []) => {
  const _template = {
    review_level_id: '{{#? PURCHASEORDERDIVISIONREVIEWLEVELID}}',
    review_level_name: '{{#? PURCHASEORDERDIVISIONREVIEWLEVELNAME}}',
    company_name: '{{#? COMPANYNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const departmentList = (data = []) => {
  const _template = {
    review_level_id: '{{#? PURCHASEORDERDIVISIONREVIEWLEVELID}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const positionList = (data = []) => {

  const _template = {
    review_level_id: '{{#? PURCHASEORDERDIVISIONREVIEWLEVELID}}',
    department_id: '{{#? DEPARTMENTID}}',
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};


const options = (users = []) => {
  const template = {
      'stocks_id': '{{#? STOCKSID}}',
      'address': '{{#? ADDRESS}}',
      'id': '{{#? STOCKSID}}',
      'name': '{{#? STOCKSNAME}}',
      'label': '{{#? STOCKSNAME}}' ,
      'value' : '{{#? STOCKSID}}',
      'type': '{{#? TYPESTOCK}}',
      'store_id': '{{#? STOREID}}',


  };

  let transform = new Transform(template);
  return transform.transform(users, [
      'id', 'stocks_code', 'name', 'address','store_id','type' , 'label' ,'value'
  ]);
};


const genStocksOutRequestCode = area => {
  const template = {
    'stocks_out_request_code': '{{#? STOCKSOUTREQUESTCODE}}',
  };
  let transform = new Transform(template);
  return transform.transform(area, ['stocks_out_request_code']);
};

const genStocksOutType = area => {
  const template = {
    'stocks_out_type': '{{#? STOCKSOUTTYPE}}',
  };
  let transform = new Transform(template);
  return transform.transform(area, ['stocks_out_type']);
};

const genCodeDivision = area => {
  const template = {
    'purchase_order_division_code': '{{#? PURCHASEORDERDIVISIONCODE}}',
  };
  let transform = new Transform(template);
  return transform.transform(area, ['purchase_order_division_code']);
};


const genStocksInRequestCode = area => {
  const template = {
    'stocks_in_request_code': '{{#? STOCKSINCODE}}',
  };
  let transform = new Transform(template);
  return transform.transform(area, ['stocks_in_request_code']);
};

const genStocksInType = area => {
  const template = {
    'stocks_in_type': '{{#? STOCKSINTYPE}}',
  };
  let transform = new Transform(template);
  return transform.transform(area, ['stocks_in_type']);
};

const stockOfBusiness = stocks => {
  const template = {
    'id': '{{#? ID}}',
    'name': '{{#? NAME}}',
  };
  let transform = new Transform(template);
  return transform.transform(stocks, ['id', 'name']);
};

const getInventoryByProduct = stocks => {
  const template = {
    'product_id': '{{#? PRODUCTID}}',
    'quantity': '{{#? QUANTITY}}',
  };
  let transform = new Transform(template);
  return transform.transform(stocks, Object.keys(template));
};

const getExpectedQuantity = stocks => {
  const template = {
    'product_id': '{{#? PRODUCTID}}',
    'expected_quantity': '{{#? EXPECTEDQUANTITY}}',
    'product_name': '{{#? PRODUCTNAME}}',
    'expected_date': '{{#? EXPECTEDDATE}}',
    'warehouse_quantity': '{{#? WAREHOUSEDQUANTITY}}',
  };
  let transform = new Transform(template);
  return transform.transform(stocks, Object.keys(template));
};

const getBusinessByStore = data => {
  const template = {
    'id': '{{#? ID}}',
    'name': '{{#? NAME}}',
  };
  let transform = new Transform(template);
  return transform.transform(data, Object.keys(template));
};

const proStocksInventoryList = (data) => {
  const template = {
    'pro_inventory_id': '{{#? PROINVENTORYID}}',
    'product_id': '{{#? PRODUCTID}}',
    'store_id': '{{#? STOREID}}',
    'stock_type_id': '{{#? STOCKTYPEID}}',
    'date_from': '{{#? DATEFROM}}',
    'date_to': '{{#? DATETO}}',
    'quantity_in_stock_min': '{{#? QUANTITYINSTOCKMIN}}',
    'stocks_detail_quantity': '{{#? STOCKSDETAILQUANTITY}}'
  };
  let transform = new Transform(template);
  return transform.transform(data, [
    'pro_inventory_id',
    'product_id',
    'store_id',
    'quantity_in_stock_min',
    'stocks_detail_quantity',
    'stock_type_id',
    'date_from',
    'date_to'
  ]);
};

const getHistoryOrderList = (data) => {
  const template = {
    'store_id': '{{#? STOREID}}',
    'product_id': '{{#? PRODUCTID}}',
    'quantity': '{{#? QUANTITY}}',

    
  };
  let transform = new Transform(template);
  return transform.transform(data, [
    'store_id',
    'product_id',
    'quantity',
  ]);
};

module.exports = {
  list,
  getById,
  areaList,
  storeApply,
  reviewList,
  reviewLevelList,
  departmentList,
  positionList,
  options,
  genStocksOutRequestCode,
  genStocksOutType,
  genCodeDivision,
  genStocksInType,
  genStocksInRequestCode,
  stockOfBusiness,
  getInventoryByProduct,
  getExpectedQuantity,
  getBusinessByStore,
  proStocksInventoryList,
  getHistoryOrderList
};
