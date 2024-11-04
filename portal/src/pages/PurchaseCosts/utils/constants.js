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

export const optionAccounting = [
  {
    label: 'Số lượng',
    value: '1',
    defendField: 'quantity',
    thNameCar: 'Phân bổ theo số lượng',
    thNameImport: 'Giá trị nhập kho theo tỷ lệ số lượng',
  },
  {
    label: 'Giá trị',
    value: '2',
    defendField: 'total_price',
    thNameCar: 'Phân bổ theo giá trị nhập',
    thNameImport: 'Giá trị nhập kho theo tỷ lệ giá',
  },
];

export const defendFieldMathProduct = [
  'quantity',
  'cost_price',
  'total_price',
  'total_cost_price',
  'total_cost_st_request_price',
];

export const defendFieldMathAccount = [
  'return_vat_money',
  'money',
];

export const DEFMATHTOTALPRODUCT = 'total';
export const DEFMATHTOTALACCOUNT = 'total_account';
export const DEFSYSBOLASSSIGN = '_';

export const defendKeyAccountCheck = [
  'explain',
  'debt_account',
  'credit_account',
  'tax_account',
  'cost_money',
  'vat_money',
  'return_vat_money',
  'money',
]

export const PAYMENT_TYPE = {
  CASH: 1,
  TRANSFER: 2,
};

export const PAYMENT_TYPE_OPTIONS = [
  {
    label: 'Tiền mặt',
    value: PAYMENT_TYPE.CASH,
  },
  {
    label: 'Chuyển khoản',
    value: PAYMENT_TYPE.TRANSFER,
  },
];
