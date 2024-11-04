import { PERMISSION_CARE_ACTIONS } from "pages/Customer/utils/constants";

export const PERMISSION = {
  ADD: 'CUSTOMER_WORKING_ADD',
  EDIT: 'CUSTOMER_WORKING_EDIT',
  VIEW: 'CUSTOMER_WORKING_VIEW',
  DEL: 'CUSTOMER_WORKING_DEL',
  EXPORT: 'CUSTOMER_WORKING_EXPORT',
  IMPORT: 'CUSTOMER_WORKING_IMPORT',
  SELECT_COMPANY: 'CUSTOMER_WORKING_SELECT_COMPANY',
  ...PERMISSION_CARE_ACTIONS
};

export const STATUS_ORDER = {
  NOTORDER: 0,
  ORDERED: 1,
  ALL: 2,
};

export const STATUS_ORDER_OPTIONS = [
  {
    label: 'Tất cả',
    value: STATUS_ORDER.ALL,
  },
  {
    label: 'Đã đặt hàng',
    value: STATUS_ORDER.ORDERED,
  },
  {
    label: 'Chưa đặt hàng',
    value: STATUS_ORDER.NOTORDER,
  },
];

export const STATUS_REVIEW = {
  NOTREVIEW: 0, // không duyệt
  REVIEWED: 1, // đã duyệt
  REVIEWING: 2, // chưa duyệt
  ALL: 3,
};

export const GENDER = {
  FEMALE: 0,
  MALE: 1,
  ALL: 2
}

export const GENDER_OPTIONS = [
  {
    label: 'Tất cả',
    value: GENDER.ALL
  },
  {
    label: 'Nam',
    value: GENDER.MALE
  },
  {
    label: 'Nữ',
    value: GENDER.FEMALE
  }
]

export const MODAL = {
  IMPORT: 'bw_modal_customer_working_import',
  IMPORT_ERROR: 'bw_modal_customer_working_import_error',
  ADD_COMPANY: 'bw_modal_customer_working_add_company',
  RESET_PASSWORD: 'bw_modal_customer_working_reset_password',
  AFFILIATE: 'bw_modal_customer_working_affiliate',
}

export const TASK_STATUS = {
  ASSIGNED: 'ASSIGNED',
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  IN_PROCESS: 'IN_PROCESS',
}
