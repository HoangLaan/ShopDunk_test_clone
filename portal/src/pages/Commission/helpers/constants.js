export const COMMISSION_PERMISSION = {
  ADD: 'SL_COMMISSION_ADD',
  EDIT: 'SL_COMMISSION_EDIT',
  VIEW: 'SL_COMMISSION_VIEW',
  DEL: 'SL_COMMISSION_DEL',
  REVIEW: 'SL_COMMISSION_REVIEW',
};

export const TYPE_VALUE = {
  MONEY: 1, // theo đ
  PERCENT: 2, // theo %
};

export const REVIEW_STATUS = {
  UNAPPROVED: 0, // chưa duyệt
  APPROVED: 1, // đồng ý duyệt
  REFUSE: 2, // từ chối duyệt
};

export const DIVIDE_BY = {
  BY_DEPARTMENT: 1,
  BY_SHIFT: 2,
  TO_SALE_EMPLOYEE: 3,
};

export const INIT_COMMISSION = {
  is_active: 1,
  is_stopped: 0,
  type_value: TYPE_VALUE.PERCENT,
  is_divide: DIVIDE_BY.BY_DEPARTMENT.toString(),
  stores: [],
};

export const COMMISSION_STATUS = {
  NOT_APPROVED: 0,
  NOT_APPLIED: 1,
  CURRENTLY_APPLIED: 2,
  STOPPED: 3,
  APPROVED_DENIED: 4,
  ALL: 5,
};

export const COMMISSION_STATUS_OPTIONS = [
  {
    label: 'Tất cả',
    value: COMMISSION_STATUS.ALL,
  },
  {
    label: 'Chưa duyệt',
    value: COMMISSION_STATUS.NOT_APPROVED,
  },
  {
    label: 'Chưa áp dụng',
    value: COMMISSION_STATUS.NOT_APPLIED,
  },
  {
    label: 'Đang áp dụng',
    value: COMMISSION_STATUS.CURRENTLY_APPLIED,
  },
  {
    label: 'Dừng áp dụng',
    value: COMMISSION_STATUS.STOPPED,
  },
  {
    label: 'Từ chối duyệt',
    value: COMMISSION_STATUS.APPROVED_DENIED,
  },
];
