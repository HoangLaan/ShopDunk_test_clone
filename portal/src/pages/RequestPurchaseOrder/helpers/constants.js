export const PERMISSION = {
  ADD: 'REQUEST_PURCHASE_ORDER_ADD',
  EDIT: 'REQUEST_PURCHASE_ORDER_EDIT',
  VIEW: 'REQUEST_PURCHASE_ORDER_VIEW',
  REVIEW: 'REQUEST_PURCHASE_ORDER_REVIEW',
  DEL: 'REQUEST_PURCHASE_ORDER_DEL',
  PRINT: 'REQUEST_PURCHASE_ORDER_PRINT',
  ADD_REVIEW: 'REQUEST_PURCHASE_ORDER_ADD_REVIEW',
  DEL_REVIEW: 'REQUEST_PURCHASE_ORDER_DEL_REVIEW',
  ADD_PRODUCT: 'REQUEST_PURCHASE_ORDER_ADD_PRODUCT',
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


export const MOCK_INITIAL_VALUES = {
  "company_id": 1,
  "business_request_id": 3,
  "business_receive_id": 1,
  "department_request_id": 1,
  "store_receive_id": 1,
  "supplier_id": 1012
};

export const RP_STATUS = {
  WAITING: 1,
  REJECTED: 2,
  OVER_BUDGET: 3,
}

export const RP_STATUS_OPTIONS = [
  {
    label: 'Chờ đặt hàng',
    value: RP_STATUS.WAITING,
  },
  {
    label: 'Từ chối',
    value: RP_STATUS.REJECTED,
  },
  {
    label: 'Vượt ngân sách',
    value: RP_STATUS.OVER_BUDGET,
  },
]

export const APPROVE_STATUS = {
  REVIEWED : 1,
  NOTREVIEW : 0,
  NOTYETREVIEW : 2
};

export const ORDER_STATUS = {
  ORDERED : 'Đã đặt hàng',
  NOTYETORDER : 'Chưa đặt hàng',
};
