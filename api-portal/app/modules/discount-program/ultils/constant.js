const DebitType = {
    RECEIVE: 1,
    PAYMENT: 2,
};

const DebitTypeOptions = [
    {
        value: DebitType.RECEIVE,
        label: 'Công nợ phải thu',
    },
    {
        value: DebitType.PAYMENT,
        label: 'Công nợ phải trả',
    },
];

const TradeInProgramApplyStatus = {
    ALL: 0,
    APPLYING: 1,
    NOT_APPLIED: 2,
    STOPPED: 3,
};

const TradeInProgramApplyStatusOptions = [
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

const CurrencyType = {
    MONEY: 1, // theo đ
    PERCENT: 2, // theo %
};

const PromotionCodeType = {
    SUPPLIER: 1,
    SHOPDUNK: 0,
};

const PromotionCodeTypeOptions = [
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

const ServicePackageType = {
    FREE: 1,
    ADD_TIME: 0,
};

const ServicePackageTypeOptions = [
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

const InstallmentType = {
    FINANCE_COMPANY: 1,
    BANK: 0,
};

const InstallmentTypeOptions = [
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

module.exports = {
    DebitType,
    DebitTypeOptions,
    TradeInProgramApplyStatus,
    TradeInProgramApplyStatusOptions,
    CurrencyType,
    PromotionCodeType,
    PromotionCodeTypeOptions,
    ServicePackageType,
    ServicePackageTypeOptions,
    InstallmentType,
    InstallmentTypeOptions,
};
