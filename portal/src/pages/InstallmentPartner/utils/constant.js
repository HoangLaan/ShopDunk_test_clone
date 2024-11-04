const VIET_NAM = 6;
const ANH = 1;

export const PAYMENT_TYPE = {
  FIXED: 1,
  FLEXIBLE: 2,
};

export const UNITS = {
  DAYS: 1,
  MONTHS: 2,
};

export const PAYER = {
  BUYER: 1,
  COMPANY: 2,
};

export const PARTNER_TYPE = {
  CARD: 1,
  COMPANY: 2,
  BOTH: 3,
};

const DefaultFilter = {
  search: '',
  is_active: 1,
};

const DefaultValue = {
  is_active: 1,
  is_system: 0,
  country_id: VIET_NAM,
  contact_vocative: ANH,
  checking_on_weekend: 1,
  payment_on_weekend: 1,
  installment_partner_type: PARTNER_TYPE.CARD,
};

const VocativeOptions = [
  {
    label: 'Anh',
    value: 1,
  },
  {
    label: 'Chị',
    value: 2,
  },
];

const PeriodUnitOptions = [
  {
    label: 'Ngày',
    value: UNITS.DAYS,
  },
  {
    label: 'Tháng',
    value: UNITS.MONTHS,
  },
];

const PayerOptions = [
  {
    label: 'Người mua',
    value: PAYER.BUYER,
  },
  {
    label: 'Công ty',
    value: PAYER.COMPANY,
  },
];

const PayTypeOptions = [
  {
    label: 'Cố định',
    value: PAYMENT_TYPE.FIXED,
  },
  {
    label: 'Linh động',
    value: PAYMENT_TYPE.FLEXIBLE,
  },
];

const PartnerTypeOptions = [
  {
    label: 'Qua thẻ',
    value: 1,
  },
  {
    label: 'Qua công ty tài chính',
    value: 2,
  },
  {
    label: 'Qua thẻ và qua công ty tài chính',
    value: 3,
  },
];

export {
  DefaultFilter,
  DefaultValue,
  VocativeOptions,
  PeriodUnitOptions,
  PayerOptions,
  PayTypeOptions,
  PartnerTypeOptions,
};
