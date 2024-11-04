const OUTPUT_TYPE = {
  ALL: 2,
  OUT: 1, // đã xuất kho
  NON: 0, // chưa xuất kho
};

const REVIEW_TYPE = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
};

const STOCKSOUT_PERMISSION = {
  ADD: 'ST_STOCKSOUTREQUEST_ADD',
  EDIT: 'ST_STOCKSOUTREQUEST_EDIT',
  REVIEW: 'ST_STOCKSOUTREQUEST_REVIEW',
  VIEW: 'ST_STOCKSOUTREQUEST_VIEW',
  DEL: 'ST_STOCKSOUTREQUEST_VIEW',
  PRINT: 'ST_STOCKSOUTREQUEST_PRINT',
  PRINT_INVOICE: 'ST_STOCKSOUTREQUEST_EXPORT_INVOICE',
  PRINT_TRANSPORT: 'ST_STOCKSOUTREQUEST_PRINT_TRANSPORT',
};

const KEY_DETAIL = {
  AREA: 'area_id',
  STOCKS_OUT_TYPE: 'stocks_out_type_id',
  STOCKS_OUT_REQUEST_CODE: 'stocks_out_request_code',
  DEPARTMENT: 'department_id',
  STORE: 'from_store_id',
  MANUFACTURER: 'MANUFACTURER',
  TO_STORE: 'to_store',
  CUSTOMER: 'customer',
  REQUEST_USER: 'request_user',
  FROM_STOCKS: 'from_stocks',
  TO_STOCKS: 'to_stocks',
  PHONE_NUMBER: 'phone_number',
  EXPORT_USER: 'export_user',
  ADRESSS: 'adress',
  RECEIVER_USER: 'receiver_user',
  NOTE: 'note',
  STOCKSOUTREQUEST_IMAGES: 'StocksOutRequestImages',
  CREATED_USER: 'created_user',
};
export { OUTPUT_TYPE, REVIEW_TYPE, STOCKSOUT_PERMISSION, KEY_DETAIL };
