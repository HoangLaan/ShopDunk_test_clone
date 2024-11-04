import moment from 'moment';
import { getStartEndDateOfMonth } from './helper';

const VIET_NAM = 6;
const ANH = 1;

const TIME_RANGE = {
  BEGINNING_OF_YEAR_TO_PRESENT: 0,
  MONTH_1: 1,
  MONTH_2: 2,
  MONTH_3: 3,
  MONTH_4: 4,
  MONTH_5: 5,
  MONTH_6: 6,
  MONTH_7: 7,
  MONTH_8: 8,
  MONTH_9: 9,
  MONTH_10: 10,
  MONTH_11: 11,
  MONTH_12: 12,
  QUARTER_1: 13,
  QUARTER_2: 14,
  QUARTER_3: 15,
  QUARTER_4: 16,
  CURRENT_YEAR: 17,
};

export const OBJECT_TYPE = {
  STAFF: 1,
  SUPPLIER: 2,
  INDIVIDUAL_CUSTOMER: 3,
  BUSINESS_CUSTOMER: 4,
  PARTNER: 5,
};

export const VAT_VALUE = {
  TEN_PERCENT: 1, // 10%
  EIGHT_PERCENT: 2, // 8%
  FIVE_PERCENT: 3, // 5%
  ZERO_PERCENT: 4, // 0%
  KCT: 5,
};

export const CHANGE_TYPE = {
  DEBT: 1,
  CREDIT: 2,
  ALL: 3,
};

export const VOUCHER_TYPE = {
  RECEIVE: 1,
  EXPEND: 2,
};

export const PAYMENT_TYPE = {
  FIXED: 1,
  FLEXIBLE: 2,
};

export const TAX_TYPE = {
  INCREASE_INPUT: 1,
  INCREASE_OUTPUT: 2,
  VAT_IN: 3,
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

export const BOOKKEEPING_STATUS = {
  ALL: 2,
  PENDING: 0,
  CONFIRMED: 1,
};

const DATE_FORMAT = 'DD/MM/YYYY';

const TimeRangeOpttions = [
  {
    label: 'Đầu năm đến hiện tại',
    value: TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT,
    start_date: moment().startOf('year').format(DATE_FORMAT),
    end_date: moment().format(DATE_FORMAT),
  },
  {
    label: 'Tháng 1',
    value: TIME_RANGE.MONTH_1,
    start_date: getStartEndDateOfMonth(1).startDate,
    end_date: getStartEndDateOfMonth(1).endDate,
  },
  {
    label: 'Tháng 2',
    value: TIME_RANGE.MONTH_2,
    start_date: getStartEndDateOfMonth(2).startDate,
    end_date: getStartEndDateOfMonth(2).endDate,
  },
  {
    label: 'Tháng 3',
    value: TIME_RANGE.MONTH_3,
    start_date: getStartEndDateOfMonth(3).startDate,
    end_date: getStartEndDateOfMonth(3).endDate,
  },
  {
    label: 'Tháng 4',
    value: TIME_RANGE.MONTH_4,
    start_date: getStartEndDateOfMonth(4).startDate,
    end_date: getStartEndDateOfMonth(4).endDate,
  },
  {
    label: 'Tháng 5',
    value: TIME_RANGE.MONTH_5,
    start_date: getStartEndDateOfMonth(5).startDate,
    end_date: getStartEndDateOfMonth(5).endDate,
  },
  {
    label: 'Tháng 6',
    value: TIME_RANGE.MONTH_6,
    start_date: getStartEndDateOfMonth(6).startDate,
    end_date: getStartEndDateOfMonth(6).endDate,
  },
  {
    label: 'Tháng 7',
    value: TIME_RANGE.MONTH_7,
    start_date: getStartEndDateOfMonth(7).startDate,
    end_date: getStartEndDateOfMonth(7).endDate,
  },
  {
    label: 'Tháng 8',
    value: TIME_RANGE.MONTH_8,
    start_date: getStartEndDateOfMonth(8).startDate,
    end_date: getStartEndDateOfMonth(8).endDate,
  },
  {
    label: 'Tháng 9',
    value: TIME_RANGE.MONTH_9,
    start_date: getStartEndDateOfMonth(9).startDate,
    end_date: getStartEndDateOfMonth(9).endDate,
  },
  {
    label: 'Tháng 10',
    value: TIME_RANGE.MONTH_10,
    start_date: getStartEndDateOfMonth(10).startDate,
    end_date: getStartEndDateOfMonth(10).endDate,
  },
  {
    label: 'Tháng 11',
    value: TIME_RANGE.MONTH_11,
    start_date: getStartEndDateOfMonth(11).startDate,
    end_date: getStartEndDateOfMonth(11).endDate,
  },
  {
    label: 'Tháng 12',
    value: TIME_RANGE.MONTH_12,
    start_date: getStartEndDateOfMonth(12).startDate,
    end_date: getStartEndDateOfMonth(12).endDate,
  },
  {
    label: 'Quý 1',
    value: TIME_RANGE.QUARTER_1,
    start_date: getStartEndDateOfMonth(1).startDate,
    end_date: getStartEndDateOfMonth(3).endDate,
  },
  {
    label: 'Quý 2',
    value: TIME_RANGE.QUARTER_2,
    start_date: getStartEndDateOfMonth(4).startDate,
    end_date: getStartEndDateOfMonth(6).endDate,
  },
  {
    label: 'Quý 3',
    value: TIME_RANGE.QUARTER_3,
    start_date: getStartEndDateOfMonth(7).startDate,
    end_date: getStartEndDateOfMonth(9).endDate,
  },
  {
    label: 'Quý 4',
    value: TIME_RANGE.QUARTER_4,
    start_date: getStartEndDateOfMonth(10).startDate,
    end_date: getStartEndDateOfMonth(12).endDate,
  },
  {
    label: 'Năm nay',
    value: TIME_RANGE.CURRENT_YEAR,
    start_date: getStartEndDateOfMonth(1).startDate,
    end_date: getStartEndDateOfMonth(12).endDate,
  },
];

const DefaultFilter = {
  search: '',
  is_bookkeeping: BOOKKEEPING_STATUS.CONFIRMED,
  voucher_type: 0,
  time_range: TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT,
  start_date: TimeRangeOpttions.find((_) => _.value === TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT).start_date,
  end_date: TimeRangeOpttions.find((_) => _.value === TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT).end_date,
};

const DefaultValue = {
  created_date: moment().format('DD/MM/YYYY'),
  invoice_date: moment().format('DD/MM/YYYY'),
  payment_expired_date: moment().format('DD/MM/YYYY'),
  is_merge_invoice: 0,
  not_declare_tax: 0,
};

const DefaultParams = {
  is_active: 1,
  itemsPerPage: 25,
  page: 1,
  is_bookkeeping: BOOKKEEPING_STATUS.CONFIRMED,
  start_date: TimeRangeOpttions.find((_) => _.value === TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT).start_date,
  end_date: TimeRangeOpttions.find((_) => _.value === TIME_RANGE.BEGINNING_OF_YEAR_TO_PRESENT).end_date,
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

const TaxTypeOptions = [
  {
    label: 'Tăng thuế đầu vào',
    value: TAX_TYPE.INCREASE_INPUT,
  },
  {
    label: 'Tăng thuế đầu ra',
    value: TAX_TYPE.INCREASE_OUTPUT,
  },
  {
    label: 'Thuế VAT đầu vào không được khấu trừ',
    value: TAX_TYPE.VAT_IN,
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

const BookkeepingStatusOption = [
  { value: BOOKKEEPING_STATUS.ALL, label: 'Tất cả' },
  { value: BOOKKEEPING_STATUS.PENDING, label: 'Chưa ghi sổ' },
  { value: BOOKKEEPING_STATUS.CONFIRMED, label: 'Đã ghi sổ' },
];

const ObjectTypeOptions = [
  {
    value: OBJECT_TYPE.STAFF,
    label: 'Nhân viên',
  },
  {
    value: OBJECT_TYPE.SUPPLIER,
    label: 'Nhà cung cấp',
  },
  {
    value: OBJECT_TYPE.INDIVIDUAL_CUSTOMER,
    label: 'Khách hàng cá nhân',
  },
  {
    value: OBJECT_TYPE.BUSINESS_CUSTOMER,
    label: 'Khách hàng doanh nghiệp',
  },
  {
    value: OBJECT_TYPE.PARTNER,
    label: 'Đối tác',
  },
];

const VatOptions = [
  {
    value: VAT_VALUE.TEN_PERCENT,
    label: '10%',
    percent: 10,
  },
  {
    value: VAT_VALUE.EIGHT_PERCENT,
    label: '8%',
    percent: 8,
  },
  {
    value: VAT_VALUE.FIVE_PERCENT,
    label: '5%',
    percent: 5,
  },
  {
    value: VAT_VALUE.ZERO_PERCENT,
    label: '0%',
    percent: 0,
  },
  {
    value: VAT_VALUE.KCT,
    label: 'KCT',
    percent: 0,
  },
];

export {
  DefaultFilter,
  DefaultValue,
  VocativeOptions,
  PeriodUnitOptions,
  PayerOptions,
  PartnerTypeOptions,
  BookkeepingStatusOption,
  TimeRangeOpttions,
  TaxTypeOptions,
  ObjectTypeOptions,
  VatOptions,
  DefaultParams,
};
