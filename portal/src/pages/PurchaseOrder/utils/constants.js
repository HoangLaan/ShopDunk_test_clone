export const REVIEW_TYPE = {
  PENDING: null,
  ACCEPT: 1,
  REJECT: 0,
};

export const INVOICE_STATUS = {
  NOT_HAVE: 0,
  HAVE: 1,
  ALL: 2,
};

export const REVIEW_STATUS_TYPES = {
  NOREVIEW: 0,
  REVIEWED: 1,
  NOTYETREVIEW: 2,
  REVIEWING: 3,
  ALL: 4,
};
export const TYPE_REVIEW = {
  PENDING: -1,
  ACCEPT: 1,
  REJECT: 0,
};
export const reviewTypeOptions = [
  {
    label: 'Chưa duyệt',
    colorLabel: 'bw_black',
    className: '',
    icon: 'fi-rr-minus',
    value: TYPE_REVIEW.PENDING,
  },
  {
    label: 'Đã duyệt',
    colorLabel: 'bw_green',
    className: 'bw_agree',
    icon: 'fi-rr-check',
    value: TYPE_REVIEW.ACCEPT,
  },
  {
    label: 'Không duyệt',
    colorLabel: 'bw_red',
    className: 'bw_non_agree',
    icon: 'fi-rr-minus',
    value: TYPE_REVIEW.REJECT,
  },
];

export const reviewStatusOption = [
  {
    label: 'Tất cả',
    value: REVIEW_STATUS_TYPES.ALL,
  },
  {
    label: 'Đã duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWED,
  },
  {
    label: 'Chưa duyệt',
    value: REVIEW_STATUS_TYPES.NOTYETREVIEW,
  },
  {
    label: 'Đang duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWING,
  },
  {
    label: 'Không duyệt',
    value: REVIEW_STATUS_TYPES.NOREVIEW,
  },
];
export const STATUS_PAYMENT = {
  PAID: 1,
  UNPAID: 0,
  PARTLYPAID: 2,
  ALL: 3,
};

export const statusPaymentOption = [
  {
    label: 'Tất cả',
    value: STATUS_PAYMENT.ALL,
  },
  {
    label: 'Đã thanh toán',
    value: STATUS_PAYMENT.PAID,
  },
  {
    label: 'Chưa thanh toán',
    value: STATUS_PAYMENT.UNPAID,
  },
  {
    label: 'Thanh toán một phần',
    value: STATUS_PAYMENT.PARTLYPAID,
  },
];

export const InvoiceStatusOption = [
  {
    label: 'Tất cả',
    value: INVOICE_STATUS.ALL,
  },
  {
    label: 'Đã có hóa đơn',
    value: INVOICE_STATUS.HAVE,
  },
  {
    label: 'Chưa có hóa đơn',
    value: INVOICE_STATUS.NOT_HAVE,
  },
];

export const STATUS_PURCHASE_ORDERS = {
  ALL: 0,
  TRANSPORTING: 1,
  ORDERING: 2,
  CONFIRM: 3,
  IMPORTED: 4,
};

export const statusPurchaseOrdersOption = [
  {
    label: 'Tất cả',
    value: STATUS_PURCHASE_ORDERS.ALL,
  },
  {
    // label: 'Đang đặt hàng',
    label: 'Đơn hàng mua, chờ vận chuyển',
    value: STATUS_PURCHASE_ORDERS.TRANSPORTING,
  },
  {
    label: 'Hàng đi đường',
    value: STATUS_PURCHASE_ORDERS.ORDERING,
  },
  {
    // label: 'Nhà cung cấp xác nhận',
    label: 'Hàng đã về, chờ nhập kho',
    value: STATUS_PURCHASE_ORDERS.CONFIRM,
  },
  {
    // label: 'Đã nhập kho',
    label: 'Đã nhập hàng',
    value: STATUS_PURCHASE_ORDERS.IMPORTED,
  },
];

export const statusPurchaseOrdersFormOption = [
  {
    label: 'Đang đặt hàng',
    value: STATUS_PURCHASE_ORDERS.ORDERING,
  },
  {
    label: 'Nhà cung cấp xác nhận',
    value: STATUS_PURCHASE_ORDERS.CONFIRM,
  },
  {
    label: 'Hàng đi đường',
    value: STATUS_PURCHASE_ORDERS.TRANSPORTING,
  },
  {
    label: 'Đã nhập kho',
    value: STATUS_PURCHASE_ORDERS.IMPORTED,
  },
];
export const statusPaymentFormOption = [
  {
    label: 'Đã thanh toán',
    value: STATUS_PAYMENT.PAID,
  },
  {
    label: 'Chưa thanh toán',
    value: STATUS_PAYMENT.UNPAID,
  },
  {
    label: 'Thanh toán một phần',
    value: STATUS_PAYMENT.PARTLYPAID,
  },
];

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
