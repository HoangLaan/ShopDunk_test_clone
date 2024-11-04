const { STATUS_TYPES } = require('utils/constants');

export const reviewStatus = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
  NOT_REVIEW: 3,
};

// 0: chưa xuất
// 1: đã xuất
// 2: đã trả 1 phần
// 3: đã trả hết
export const borrowStatus = {
  ALL: -1,
  NOT_EXPORT: 0,
  EXPORTED: 1,
  RETURNED_PART: 2,
  RETURNED_ALL: 3,
  OVERDUE: 4,
};

export const borrowStatusOptions = [
  {
    value: borrowStatus.ALL,
    label: 'Tất cả',
  },
  {
    value: borrowStatus.NOT_EXPORT,
    label: 'Chưa xuất',
  },
  {
    value: borrowStatus.EXPORTED,
    label: 'Đã xuất',
  },
  {
    value: borrowStatus.RETURNED_PART,
    label: 'Đã trả 1 phần',
  },
  {
    value: borrowStatus.RETURNED_ALL,
    label: 'Đã trả hết',
  },
  {
    value: borrowStatus.OVERDUE,
    label: 'Quá hạn',
  },
];

export const defaultValues = {
  is_active: STATUS_TYPES.ACTIVE,
  is_system: STATUS_TYPES.HIDDEN,
  is_review: reviewStatus.NOT_REVIEW,
  borrow_status: borrowStatus.NOT_EXPORT,
};
