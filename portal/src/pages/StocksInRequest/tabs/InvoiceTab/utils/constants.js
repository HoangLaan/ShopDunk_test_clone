const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID: 1,
  PARTIAL_PAYMENT: 2,
};

const PAYMENT_STATUS_OPTIONS = [
  {
    label: 'Chưa thanh toán',
    value: PAYMENT_STATUS.UNPAID,
  },
  {
    label: 'Thanh toán một phần',
    value: PAYMENT_STATUS.PARTIAL_PAYMENT,
  },
  {
    label: 'Đã thanh toán',
    value: PAYMENT_STATUS.PAID,
  },
];

const PAYMENT_DUE_STATUS = {
  DONE: 1,
  NOT_EXPIRED: 2,
  EXPIRED: 3,
  DONE_BUT_EXPIRED: 4,
};

const PAYMENT_METHOD = {
  CASH: 1,
  CREDIT: 2,
};

export { PAYMENT_STATUS, PAYMENT_STATUS_OPTIONS, PAYMENT_DUE_STATUS, PAYMENT_METHOD };
