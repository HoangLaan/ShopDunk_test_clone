const STOCKS_TAKE_REQUEST_PERMISSION = {
  EDIT: 'ST_STOCKSTAKEREQUESTPERIOD_EDIT',
  VIEW: 'ST_STOCKSTAKEREQUESTPERIOD_VIEW',
  ADD: 'ST_STOCKSTAKEREQUESTPERIOD_ADD',
  DELETE: 'ST_STOCKSTAKEREQUESTPERIOD_DEL',
};

const ROUTE_STOCKS_TAKE_REQUEST = {
  MAIN: '/stocks-take-request',
  EDIT: (id) => `/stocks-take-request/edit/${id}`,
  VIEW: (id) => `/stocks-take-request/${id}/detail`,
  ADD: '/stocks-take-request/add',
};

const PROCESSING_STEP_TYPES = {
  WAIT: 0, // chưa xử lí
  DONE: 1, // HOAN THANH
  ALL: 2, // Tất cả
};

const REVIEW_TYPES = {
  REJECT: 0, // k duyet
  APPROVED: 1, // da duyet
  TOBE: 2, // chua duyet DANG CHO duuetj
  WAIT: 3, // đang trong quá trình duyệt
  ALL: 4, // Tất cả hình thức
};

const FIELD_STOCKSTAKEREQUEST = {
  created_user: 'created_user',
  created_date: 'created_date',
  stocks_name: 'stocks_name',
  stocks_take_request_id: 'stocks_take_request_id',
  stocks_take_request_code: 'stocks_take_request_code',
  stocks_take_request_name: 'stocks_take_request_name',
  stocks_take_type_id: 'stocks_take_type_id',
  stocks_take_type_name: 'stocks_take_type_name',
  stocks_take_request_user: 'stocks_take_request_user',
  stocks_take_request_date: 'stocks_take_request_date',
  department_request_id: 'department_request_id',
  stocks_id: 'stocks_id',
  stocks_stocks_list: 'stocks_id',
  stocks_list_id: 'stocks_list_id',
  address: 'address',
  receiver: 'receiver',
  stocks_take_users: 'stocks_take_users',
  user_review_list: 'user_review_list',
  create_date_from: 'create_date_from',
  create_date_to: 'create_date_to',
  description: 'description',
  note: 'note',
  is_reviewed: 'is_reviewed',
  is_active: 'is_active',
  store_apply_list: 'store_apply_list',
};

const INFORMATION_KEY = {
  COMMON: 'COMMON',
  REQUEST: 'REQUEST',
  INVENTORY_PERSON: 'INVENTORY_PERSON',
  STORE: 'STORE',
};

const DEFAULT_REVIEW_DATA = {
  is_show_review_btn: false,
  is_show_review_modal: false,
  stocks_take_review_list_id: undefined,
  stocks_review_level_id: undefined,
};

export {
  STOCKS_TAKE_REQUEST_PERMISSION,
  FIELD_STOCKSTAKEREQUEST,
  ROUTE_STOCKS_TAKE_REQUEST,
  PROCESSING_STEP_TYPES,
  INFORMATION_KEY,
  REVIEW_TYPES,
  DEFAULT_REVIEW_DATA,
};
