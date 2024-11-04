export const DebitType = {
  RECEIVE: 1,
  PAYMENT: 2,
};

export const DebitTypeOptions = [
  {
    value: DebitType.RECEIVE,
    label: 'Công nợ phải thu',
  },
  {
    value: DebitType.PAYMENT,
    label: 'Công nợ phải trả',
  },
];

export const TradeInProgramApplyStatus = {
  ALL: 0,
  APPLYING: 1,
  NOT_APPLIED: 2,
  STOPPED: 3,
};

export const TradeInProgramApplyStatusOptions = [
  {
    value: TradeInProgramApplyStatus.ALL,
    label: 'Tất cả',
  },
  {
    value: TradeInProgramApplyStatus.APPLYING,
    label: 'Đang áp dụng',
  },
  {
    value: TradeInProgramApplyStatus.NOT_APPLIED,
    label: 'Chưa áp dụng',
  },
  {
    value: TradeInProgramApplyStatus.STOPPED,
    label: 'Dừng áp dụng',
  },
];

export const CurrencyType = {
  MONEY: 1, // theo đ
  PERCENT: 2, // theo %
};

export const PromotionCodeType = {
  SUPPLIER: 1,
  SHOPDUNK: 0,
};

export const PromotionCodeTypeOptions = [
  {
    key: PromotionCodeType.SUPPLIER,
    value: PromotionCodeType.SUPPLIER,
    label: 'Mã khuyến mại của Nhà cung cấp',
  },
  {
    key: PromotionCodeType.SHOPDUNK,
    value: PromotionCodeType.SHOPDUNK,
    label: 'Mã khuyến mại của ShopDunk',
  },
];

export const ServicePackageType = {
  FREE: 1,
  ADD_TIME: 0,
};

export const ServicePackageTypeOptions = [
  {
    key: ServicePackageType.FREE,
    value: ServicePackageType.FREE,
    label: 'Được miễn phí gói dịch vụ',
  },
  {
    key: ServicePackageType.ADD_TIME,
    value: ServicePackageType.ADD_TIME,
    label: 'Được nhận thêm thời gian sử dụng gói dịch vụ',
  },
];

export const InstallmentType = {
  FINANCE_COMPANY: 1,
  BANK: 0,
};

export const InstallmentTypeOptions = [
  {
    key: InstallmentType.FINANCE_COMPANY,
    value: InstallmentType.FINANCE_COMPANY,
    label: 'Trả góp qua công ty tài chính',
  },
  {
    key: InstallmentType.BANK,
    value: InstallmentType.BANK,
    label: 'Trả góp qua ngân hàng',
  },
];

export const ReviewStatus = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
};

export const ReviewStatusOptions = [
  {
    key: ReviewStatus.PENDING,
    value: ReviewStatus.PENDING,
    label: 'Chưa duyệt',
  },
  {
    key: ReviewStatus.ACCEPT,
    value: ReviewStatus.ACCEPT,
    label: 'Đã duyệt',
  },
  {
    key: ReviewStatus.REJECT,
    value: ReviewStatus.REJECT,
    label: 'Từ chối',
  },
];

export const tabs = {
  ALL: 0,
  APPLY_REVIEW: 1,
  REJECT_REVIEW: 2,
  PENDING_REVIEW: 3,
  APPLYING: 4,
  NOT_APPLIED: 5,
  STOPPED: 6,
};

export const tabOptions = [
  {
    value: tabs.ALL,
    label: 'Tất cả',
  },
  {
    value: tabs.APPLY_REVIEW,
    label: 'Đồng ý duyệt',
  },
  {
    value: tabs.REJECT_REVIEW,
    label: 'Từ chối duyệt',
  },
  {
    value: tabs.PENDING_REVIEW,
    label: 'Chưa duyệt',
  },
  {
    value: tabs.APPLYING,
    label: 'Đang áp dụng',
  },
  {
    value: tabs.NOT_APPLIED,
    label: 'Chưa áp dụng',
  },
  {
    value: tabs.STOPPED,
    label: 'Dừng áp dụng',
  },
];
