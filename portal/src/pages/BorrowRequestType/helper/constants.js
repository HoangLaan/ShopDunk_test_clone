import { STATUS_TYPES } from 'utils/constants';

export const BORROW_TYPE_PERMISSION = {
  VIEW: 'SL_BORROWTYPE_TYPE_VIEW',
  ADD: 'SL_BORROWTYPE_TYPE_ADD',
  EDIT: 'SL_BORROWTYPE_TYPE_EDIT',
  DEL: 'SL_BORROWTYPE_TYPE_DEL',
};

export const borrowType = {
  ALL: 3,
  FOR_SALE: 0,
  BORROW_PARTNER: 1,
  OTHER: 2,
};

export const borrowTypeOptions = [
  {
    key: 'all',
    label: 'Tất cả',
    value: borrowType.ALL,
  },
  {
    key: 'is_for_sale',
    label: 'Mượn hàng để bán',
    value: borrowType.FOR_SALE,
  },
  {
    key: 'is_borrow_partner',
    label: 'Đối tác mượn hàng',
    value: borrowType.BORROW_PARTNER,
  },
  {
    key: 'is_other',
    label: 'Khác',
    value: borrowType.OTHER,
  },
];

export const defaultValues = {
  borrow_type: borrowType.OTHER,
  is_active: STATUS_TYPES.ACTIVE,
  is_system: STATUS_TYPES.HIDDEN,
  is_auto_review: true,
};
