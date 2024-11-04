import moment from 'moment';

const CURRENTCY_TYPE = {
  VND: 1,
  USD: 2,
};

export const CurrencyTypeOpts = [
  { value: CURRENTCY_TYPE.VND, label: 'VND' },
  { value: CURRENTCY_TYPE.USD, label: 'USD' },
];

export const SUBMIT_TYPE = {
  FILTER: 'FILTER',
  EXECUTE: 'EXECUTE',
};

export const VOUCHER_TYPE = {
  PAYMENTSLIP_CASH: 1,
  PAYMENTSLIP_CREDIT: 2,
  OTHER_VOUCHER: 3,
};

export const VOUCHER_DEBT_TYPE = {
  PURCHASEORDER: 1,
};

const DefaultFilter = {
  search: '',
  is_active: 1,
};

const DefaultValue = {
  currency_type: CURRENTCY_TYPE.VND,
  selected_date: moment().format('DD/MM/YYYY'),
};

export { DefaultFilter, DefaultValue };
