export const COUPON_PERMISSION = {
  ADD: 'SM_COUPON_ADD',
  EDIT: 'SM_COUPON_EDIT',
  VIEW: 'SM_COUPON_VIEW',
  DEL: 'SM_COUPON_DEL',

  SELECT_RS_ERROR: 'SM_COUPON_SELECT_RS_ERROR',
  SELECT_CUSTOMER_TYPE: 'SM_COUPON_SELECT_CUSTOMER_TYPE',
  DEL_PRODUCT: 'SM_COUPON_DEL_PRODUCT',
};

export const KEY_FORM_COUPON = {
  INFORMATION: 'INFORMATION',
  PRODUCT_APPLY: 'PRODUCT_APPLY',
  CUSTOMER_TYPE_APPLY: 'CUSTOMER_TYPE_APPLY',
  COUPON_VALUE: 'COUPON_VALUE',
  COUPON_STATUS: 'COUPON_STATUS',
  COUPON_PRODUCT: 'COUPON_PRODUCT',
  COUPON_SETTING: 'COUPON_SETTING',
  COUPON_CONFIG: 'COUPON_CONFIG',
};

export const TYPO_TITLE_FORM = {
  INFORMATION: 'Thông tin mã khuyến mại',
  ERROR_APPLY: 'Lỗi máy áp dụng',
  CUSTOMER_TYPE_APPLY: 'Áp dụng cho hạng khách hàng',
  COUPON_VALUE: 'Giá trị khuyến mại',
  COUPON_STATUS: 'Trạng thái',
  COUPON_PRODUCT: 'Áp dụng cho sản phẩm',
  COUPON_SETTING: 'Thiết lập khác',
  COUPON_CONFIG: 'Cấu hình mã giảm giá',
  COUPON_AUTOGEN_VALUE: 'Giá trị',
};

export const TYPE_PROMOTION_VALUE = {
  MONEY: 1, // theo đ
  PERCENT: 2, // theo %
};

export const TYPE_ERROR = {
  ISAPPOINTERROR: 1,
  ISANYERROR: 2,
};

export const COUPON_TYPES = {
  PENDING: 1, // chưa áp dụng
  APPLYING: 2, // đang áp dụng
  EXPIRED: 3, // hết hạn
};

export const COUPON_TYPES_OPTION = [
  { value: COUPON_TYPES.PENDING, label: 'Chưa áp dụng' },
  { value: COUPON_TYPES.APPLYING, label: 'Đang áp dụng' },
  { value: COUPON_TYPES.EXPIRED, label: 'Hết hạn' },
];

export const PANEL_TYPES = {
  INFORMATION: 'INFORMATION',
  LIST_COUPON: 'LIST_COUPON',
  LIST_AUTO_GEN_COUPON: 'LIST_AUTO_GEN_COUPON',
};

export const COUPON_AUTO_TYPES_OPTION = [
  { value: 0, label: 'Chưa sử dụng' },
  { value: 1, label: 'Đã sử dụng' },
];

export const COUPON_PRODUCT_TYPE = {
  ANY: 1,
  APPOINT: 2,
};
