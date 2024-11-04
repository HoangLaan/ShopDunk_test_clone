export const PURCHASE_REQUISITION_PERMISSION = {
  ADD: 'PO_PURCHASEREQUISITION_ADD',
  PRINT: 'PO_PURCHASEREQUISITION_PRINT',
  EDIT: 'PO_PURCHASEREQUISITION_EDIT',
  VIEW: 'PO_PURCHASEREQUISITION_VIEW',
  DEL: 'PO_PURCHASEREQUISITION_DEL',
  REVIEW: 'PO_PURCHASEREQUISITION_REVIEW',
};

export const REVIEW_TYPES = [
  {
    label: 'Tất cả',
    value: 0,
  },
  {
    label: 'Đã duyệt',
    value: 1,
  },
  {
    label: 'Không duyệt',
    value: 2,
  },
  {
    label: 'Chưa duyệt',
    value: 3,
  },
];

export const REVIEW_STATUS = {
  ALL: 0,
  ACCEPT: 1,
  REJECT: 2,
  PENDING: 3,
};

export const PR_STATUS = {
  PENDING: 1,
  COLLECTED: 2,
  NOT_COLLECTED: 3,
  CANCEL: 4,
};

export const PR_STATUS_OPTIONS = [
  {
    label: 'Chưa tổng hợp',
    value: PR_STATUS.PENDING,
  },
  {
    label: 'Đã tổng hợp',
    value: PR_STATUS.COLLECTED,
  },
  {
    label: 'Không tổng hợp',
    value: PR_STATUS.NOT_COLLECTED,
  },
  {
    label: 'Đã huỷ',
    value: PR_STATUS.CANCEL,
  },
];
