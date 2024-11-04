export const CRM_STATE = [
  {
    value: 1,
    label: 'Đã phân công chăm sóc',
  },
  {
    value: 2,
    label: 'Chưa phân công chăm sóc',
  },
  {
    value: 3,
    label: 'Đang chăm sóc',
  },
];

export const CUSTOMER_TYPE = [
  {
    value: 0,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Khách hàng cá nhân',
  },
  {
    value: 2,
    label: 'Khách hàng tiềm năng',
  },
];

export const handle_status = [
  {
    value: 1,
    label: 'Chốt đơn hàng thành công',
  },
  {
    value: 0,
    label: 'Không chốt được dơn hàng',
  },
];

export const TASK_PERMISSION = {
  ADD: 'CRM_TASK_ADD',
  VIEW: 'CRM_TASK_VIEW',
  EDIT: 'CRM_TASK_EDIT',
  DEL: 'CRM_TASK_DEL',
  VIEW_ALL: 'CRM_TASK_VIEW_ALL',
  VIEW_CUSTOMER: 'CRM_TASK_VIEW_CUSTOMER',
}

export const TYPE_PURCHASE = {
  ALL: 3,
  SUCCESS: 1,
  FAIL: 0,
  PROCESSING: null,
}

export const INTEREST_CONTENT = [
  { label: 'Trả góp', value: 1 },
  { label: 'Thu cũ đổi mới', value: 2 },
  { label: 'Đổi trả', value: 3 },
  { label: 'Chương trình khuyến mại', value: 4 },
  { label: 'Giá', value: 5 },
  { label: 'Bảo hành', value: 6 },
  { label: 'Quan tâm cọc', value: 7 },
  { label: 'Không cọc', value: 8 },
  { label: 'Khác', value: 9 },
]
