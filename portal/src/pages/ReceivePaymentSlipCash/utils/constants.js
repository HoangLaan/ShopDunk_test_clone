export const PAYMENTTYPE = {
  CASH: 1,
  TRANSFER: 2,
  CARD: 3,
};
export const ACCURACY_TYPE = {
  VND: 1,
  USD: 2,
};
export const paymentTypeOption = [
  //   { value: '', label: 'Tất cả' },
  { value: PAYMENTTYPE.CASH, label: 'Tiền mặt' },
  { value: PAYMENTTYPE.TRANSFER, label: 'Chuyển khoản' },
  { value: PAYMENTTYPE.CARD, label: 'Thẻ' },
];

export const PAYMENTSTATUS = {
  UNPAID: 0,
  PAID: 1,
};

export const REVIEW_STATUS = {
  REJECT: 0, // khong duyet
  APPROVE: 1, // da duyet
  WAIT: 2, // chua duyet
  PENDING: 3, // dang duyet
  ALL: 10,
};

export const TYPE_STATUS = {
  THU: 1, //Phiếu thu
  CHI: 2, //Phieu chi
};

export const CONFIRM_STATUS = {
  ALL: 2,
  PENDING: 0,
  CONFIRMED: 1,
};

export const confirmStatusOption = [
  { value: CONFIRM_STATUS.ALL, label: 'Tất cả' },
  { value: CONFIRM_STATUS.PENDING, label: 'Chưa ghi sổ' },
  { value: CONFIRM_STATUS.CONFIRMED, label: 'Đã ghi sổ' },
];

export const reviewStatusOption = [
  { value: REVIEW_STATUS.ALL, label: 'Tất cả' },
  { value: REVIEW_STATUS.WAIT, label: 'Chưa duyệt' },
  { value: REVIEW_STATUS.APPROVE, label: 'Đã duyệt' },
  { value: REVIEW_STATUS.PENDING, label: 'Đang duyệt' },
  { value: REVIEW_STATUS.REJECT, label: 'Không duyệt' },
];

export const typeOption = [
  { value: TYPE_STATUS.THU, label: 'Phiếu thu' },
  { value: TYPE_STATUS.CHI, label: 'Phiếu chi' },
];

export const optionsReceiveKind = [
  {
    label: 'Thu khác',
    value: 0,
    key: 'is_receive_other',
  },
  {
    label: 'Thu đơn hàng',
    value: 1,
    key: 'is_receive_order',
  },
];
export const RECEIPTSOBJECT = {
  SUPPLIER: 1,
  STAFF: 2,
  CUSTOMER: 3,
  OTHER: 4,
};
export const optionsReceiptsObject = [
  {
    label: 'Nhà cung cấp',
    value: RECEIPTSOBJECT.SUPPLIER,
  },
  {
    label: 'Nhân viên',
    value: RECEIPTSOBJECT.STAFF,
  },
  {
    label: 'Khách hàng',
    value: RECEIPTSOBJECT.CUSTOMER,
  },
  {
    label: 'Khác',
    value: RECEIPTSOBJECT.OTHER,
  },
];

export const RECEIVE_PAYMENT_TYPE = {
  RECEIVESLIP: 1,
  PAYMENTSLIP: 2,
};

export const FIELD_NOT_DISABLED = ['accounting_date', 'created_date', 'cashier_id', 'payer_id', 'descriptions'];
