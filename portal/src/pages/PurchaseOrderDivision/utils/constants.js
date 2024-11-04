export const PURCHASE_ORDER_DIVISION_PERMISSION = {
  VIEW: 'PURCHASE_ORDER_DIVISION_VIEW',
  ADD: 'PURCHASE_ORDER_DIVISION_ADD',
  EDIT: 'PURCHASE_ORDER_DIVISION_EDIT',
  DEL: 'PURCHASE_ORDER_DIVISION_DEL',
  REVIEW: 'PURCHASE_ORDER_DIVISION_REVIEW',
  ADD_NEW_REVIEW: 'PURCHASE_ORDER_DIVISION_ADD_NEW_REVIEW',
  ADD_USER_REVIEW: 'PURCHASE_ORDER_DIVISION_ADD_USER_REVIEW',
};

export const reviewTypeOptions = [
  {
    label: 'Chưa duyệt',
    colorLabel: 'bw_black',
    className: '',
    icon: 'fi-rr-minus',
    value: null,
  },
  {
    label: 'Đã duyệt',
    colorLabel: 'bw_green',
    className: 'bw_agree',
    icon: 'fi-rr-check',
    value: 1,
  },
  {
    label: 'Không duyệt',
    colorLabel: 'bw_red',
    className: 'bw_non_agree',
    icon: 'fi-rr-minus',
    value: 0,
  },
];
