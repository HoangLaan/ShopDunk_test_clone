export const PERMISSION_CARE_ACTIONS = {
  ACTIONS: 'CUSTOMER_CARE_ACTIONS',
  ACTIONS_TASK: 'CUSTOMER_CARE_ACTIONS_TASK',
  ACTIONS_EMAIL: 'CUSTOMER_CARE_ACTIONS_EMAIL',
  ACTIONS_SMS: 'CUSTOMER_CARE_ACTIONS_SMS',
  ACTIONS_ZALO: 'CUSTOMER_CARE_ACTIONS_ZALO',
  EXPORT: 'CUSTOMER_CARE_ACTIONS_EXPORT',
  SELECT_ALL: 'CUSTOMER_CARE_ACTIONS_SELECT_ALL',
};

export const PERMISSION = {
  ADD: 'CUSTOMER_ADD',
  EDIT: 'CUSTOMER_EDIT',
  VIEW: 'CUSTOMER_VIEW',
  DEL: 'CUSTOMER_DEL',
  EXPORT: 'CUSTOMER_EXPORT',
  IMPORT: 'CUSTOMER_IMPORT',
  SELECT_COMPANY: 'CUSTOMER_SELECT_COMPANY',
  ...PERMISSION_CARE_ACTIONS,
};

export const MODAL = {
  ADD_ADDRESS_BOOK: 'bw_modal_add_address_book',
  ADD_COMPANY: 'bw_modal_customer_add_company',
  ADD_HOBBIES: 'bw_modal_add_hobbies',
  ADD_RELATIVES: 'bw_modal_add_relatives',
  AFFILIATE: 'bw_modal_customer_affiliate',
  IMPORT: 'bw_modal_customer_import',
  IMPORT_ERROR: 'bw_modal_customer_import_error',
};

export const GENDER = {
  FEMALE: 0,
  MALE: 1,
  ALL: 2,
};

export const TASK_STATUS = {
  ASSIGNED: 'ASSIGNED',
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  IN_PROCESS: 'IN_PROCESS',
};

export const BUY_STATUS = {
  UNPAID: 0,
  PAID: 1,
  ALL: 2,
};

export const BUY_STATUS_OPTIONS = [
  { value: BUY_STATUS.ALL, label: 'Tất cả' },
  { value: BUY_STATUS.PAID, label: 'Đã mua hàng' },
  { value: BUY_STATUS.UNPAID, label: 'Chưa mua hàng' },
];

export const OPERATOR_OPTIONS = [
  { value: '=', label: '=' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
];

export const POINT_TYPE = {
  CUMULATE: 0, // Tích điểm
  EXCHANGE: 1, // Tiêu điểm
};

export const SMS_TEMPLATE_FIELDS = [
  {
    label: 'Sinh nhật (BIRTHDAY)',
    value: '<%= BIRTHDAY %>',
  },
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: '<%= FULLNAME %>',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: '<%= PHONENUMBER %>',
  },
  {
    label: 'Email (EMAIL)',
    value: '<%= EMAIL %>',
  },
  {
    label: 'ID Quan tâm (INTERESTID)',
    value: '<%= INTERESTID %>',
  },
];
