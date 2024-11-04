export const PAYMENTFORM_TYPE = {
  ALL: 0,
  CASH: 1,
  BANK: 2,
  PARTNER: 3,
  POS : 4,
};

export const PAYMENTFORM_TYPE_OPTIONS = [
  {
    label: 'Tất cả',
    value: PAYMENTFORM_TYPE.ALL,
  },
  {
    label: 'Tiền mặt',
    value: PAYMENTFORM_TYPE.CASH,
  },
  {
    label: 'Tiền chuyển khoản',
    value: PAYMENTFORM_TYPE.BANK,
  },
  {
    label: 'Đối tác',
    value: PAYMENTFORM_TYPE.PARTNER,
  },
  {
    label: 'Máy POS',
    value: PAYMENTFORM_TYPE.POS,
  },
];

export const PERMISSION_PAYMENT_FORM = {
  ADD: 'AC_PAYMENTFORM_ADD',
  EDIT: 'AC_PAYMENTFORM_EDIT',
  DEL: 'AC_PAYMENTFORM_DEL',
  VIEW: 'AC_PAYMENTFORM_VIEW'
}
export const PERMISSION_VIEW_BUSSINESS = {
  VIEW: 'AM_BUSSINESS_VIEW'
}