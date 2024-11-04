const CALCULATE_METHODS = {
  FIRST_IN_FIRST_OUT: 1,
  PREIODICAVCO: 2,
  CONTINUOSAVCO: 3,
  SPECIFIC_IDENTIFICATION_METHODL: 4,
};

const calTotalQuantity = (arr, productId, stocksId = null, field) => {
  let total = 0;
  for (const obj of arr) {
    if (obj.product_id == productId && ((stocksId && obj.stocks_id == stocksId) || !stocksId)) {
      total += obj[field];
    }
  }
  return total || 0;
};

const findCogs = (arr, productId, stocksId) => {
  for (const obj of arr) {
    if (obj.product_id == productId && obj.stocks_id == stocksId) {
      return obj;
    }
  }
  return null;
};

const arrayToString = (arr, concatWith = '|') => {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item) => item.id ?? item.value ?? item).join(concatWith);
};

const isNumeric = (value) => /^-?\d+$/.test(value);

const stringToArray = (str, splitWith = '|') => {
  if (typeof str !== 'string' || !str.includes(splitWith)) return isNumeric(str) ? parseInt(str) : str;
  return str?.split(splitWith)?.map((item) => parseInt(item));
};

const keysConfigMapping = {
  // Info Stocks
  business_ids_settings: 'ST_COGS_BUSINESSIDS_SETTINGS',
  stocks_ids_settings: 'ST_COGS_STOCKSIDS_SETTINGS',
  store_ids_settings: 'ST_COGS_STOREIDS_SETTINGS',
  stocks_type_list_settings: 'ST_COGS_STOCKSTYPE_SETTINGS',

  calculate_method: 'ST_COGS_CALCULATEMETHODS_SETTINGS',
  // 0: Hàng hóa cần tính giá
  // 1: Hàng hóa được chọn
  need_calculate_goods: 'ST_COGS_ISALLPRODUCT_SETTINGS',
  selected_product: 'ST_COGS_PRODUCTIDS_SETTINGS',

  calculate_date_settings: 'ST_COGS_CALCULATEDATE_SETTINGS',
  start_date_settings: 'ST_COGS_STARTDATE_SETTINGS',
  end_date_settings: 'ST_COGS_ENDDATE_SETTINGS',
  period_settings: 'ST_COGS_PERIOD_SETTINGS',

  // 1: Tính giá theo kho
  // 2: Tính giá không theo ko
  type_calculating: 'ST_COGS_TYPECALCULATING_SETTINGS',
  // 1: Hằng ngày
  // 2: Ngày cuối tháng
  type_run_service: 'ST_COGS_TYPERUNSERVICE_SETTINGS',
  time_calculating: 'ST_COGS_TIMECALCULATING_SETTINGS',
};

module.exports = {
  calTotalQuantity,
  findCogs,
  arrayToString,
  keysConfigMapping,
  stringToArray,
  CALCULATE_METHODS,
};
