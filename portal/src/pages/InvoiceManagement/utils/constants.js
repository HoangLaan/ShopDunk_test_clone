import { PERMISSION_CARE_ACTIONS } from "pages/Customer/utils/constants";

export const PERMISSION = {
  ADD: 'CUSTOMER_LEAD_ADD',
  EDIT: 'CUSTOMER_LEAD_EDIT',
  VIEW: 'CUSTOMER_LEAD_VIEW',
  DEL: 'CUSTOMER_LEAD_DEL',
  EXPORT: 'CUSTOMER_LEAD_EXPORT',
  IMPORT: 'CUSTOMER_LEAD_IMPORT',
  SELECT_COMPANY: 'CUSTOMER_LEAD_SELECT_COMPANY',
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

export const STATUS_REVIEW_OPTIONS = [
  {
    label: 'Tất cả',
    value: STATUS_REVIEW.ALL,
  },
  {
    label: 'Đã duyệt',
    value: STATUS_REVIEW.REVIEWED,
  },
  {
    label: 'Chưa duyệt',
    value: STATUS_REVIEW.REVIEWING,
  },
  {
    label: 'Không duyệt',
    value: STATUS_REVIEW.NOTREVIEW,
  },
];


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

export const CUSTOMER_TYPE = {
  LEAD: 27
}

export const MODAL = {
  IMPORT: 'bw_modal_customer_lead_import',
  IMPORT_ERROR: 'bw_modal_customer_lead_import_error',
  ADD_COMPANY: 'bw_modal_customer_lead_add_company',
  RESET_PASSWORD: 'bw_modal_customer_lead_reset_password',
  AFFILIATE: 'bw_modal_customer_lead_affiliate',
}

export const TASK_STATUS = {
  ASSIGNED: 'ASSIGNED',
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  IN_PROCESS: 'IN_PROCESS',
}
