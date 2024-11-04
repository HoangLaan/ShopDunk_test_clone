export const PROFIT_LOSS_PERMISSION = {
  VIEW: 'PO_MODELCACULATION_VIEW',
  ADD: 'PO_MODELCACULATION_ADD',
  EXPORT: 'PO_MODELCACULATION_EXPORT',
  MAKE_PRICE: 'PO_MODELCACULATION_MAKE_PRICE',
};

export const RulePrice = {
  min: {
    value: 0,
    message: 'Giá trị phải lớn hơn 0',
  },
};

export const DISCOUNT_TYPE = {
  SUPPLIER: 1,
  SHOPDUNK: 0,
};

export const VALUE_TYPE = {
  VND: 1,
  PERCENT: 2,
};

export const CHANGE_TYPE = {
  SUGGESTD_PRICE: 1,
  PROFIT_PERCENT: 2,
};
