import { PERMISSION_CARE_ACTIONS } from "pages/Customer/utils/constants";

export const PATH = '/customer-care';

export const PERMISSION = {
  ADD: 'CUSTOMER_CARE_ADD',
  EDIT: 'CUSTOMER_CARE_EDIT',
  VIEW: 'CUSTOMER_CARE_VIEW',
  DEL: 'CUSTOMER_CARE_DEL',
};

export const BUY_STATUS = {
  UNPAID: 0,
  PAID: 1,
  ALL: 2,
}
export const BUY_STATUS_OPTIONS = [
  { value: BUY_STATUS.ALL, label: 'Tất cả' },
  { value: BUY_STATUS.PAID, label: 'Đã mua hàng' },
  { value: BUY_STATUS.UNPAID, label: 'Chưa mua hàng' },
]

export const OPERATOR_OPTIONS = [
  { value: '=', label: '=' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
]

export const CUSTOMER_PERMISSION = {
  ADD: 'CRM_ACCOUNT_ADD',
  EDIT: 'CRM_ACCOUNT_EDIT',
  VIEW: 'CRM_ACCOUNT_VIEW',
  DEL: 'CRM_ACCOUNT_DEL',
  EXPORT: 'CRM_ACCOUNT_EXPORT',
}

export const CUSTOMER_CARE_PERMISSION = {
  EMAIL: 'CUSTOMER_CARE_EMAIL',
  SMS: 'CUSTOMER_CARE_SMS',
  TASK: 'CUSTOMER_CARE_TASK',
  ...PERMISSION_CARE_ACTIONS,
}

export const TASK_STATUS = {
  ASSIGNED: 'ASSIGNED',
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  IN_PROCESS: 'IN_PROCESS',
}
