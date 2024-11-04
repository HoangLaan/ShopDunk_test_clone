import moment from 'moment';

const DATE_FORMAT = 'DD/MM/YYYY';

const AccountingPeriodOptions = [
  {
    label: 'Hôm nay',
    value: 1,
    from_date: moment().format(DATE_FORMAT),
    to_date: moment().format(DATE_FORMAT),
  },
  {
    label: 'Tuần này',
    value: 2,
    from_date: moment().startOf('week').format(DATE_FORMAT),
    to_date: moment().endOf('week').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 1',
    value: 3,
    from_date: moment().startOf('year').month(0).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(0).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 2',
    value: 4,
    from_date: moment().startOf('year').month(1).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(1).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 3',
    value: 5,
    from_date: moment().startOf('year').month(2).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(2).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 4',
    value: 6,
    from_date: moment().startOf('year').month(3).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(3).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 5',
    value: 7,
    from_date: moment().startOf('year').month(4).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(4).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 6',
    value: 8,
    from_date: moment().startOf('year').month(5).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(5).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 7',
    value: 9,
    from_date: moment().startOf('year').month(6).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(6).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 8',
    value: 10,
    from_date: moment().startOf('year').month(7).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(7).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 9',
    value: 11,
    from_date: moment().startOf('year').month(8).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(8).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 10',
    value: 12,
    from_date: moment().startOf('year').month(9).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(9).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 11',
    value: 13,
    from_date: moment().startOf('year').month(10).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(10).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Tháng 12',
    value: 14,
    from_date: moment().startOf('year').month(11).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(11).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Quý 1',
    value: 15,
    from_date: moment().startOf('year').month(0).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(2).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Quý 2',
    value: 16,
    from_date: moment().startOf('year').month(3).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(5).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Quý 3',
    value: 17,
    from_date: moment().startOf('year').month(6).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(8).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Quý 4',
    value: 18,
    from_date: moment().startOf('year').month(9).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(11).endOf('month').format(DATE_FORMAT),
  },
  {
    label: 'Năm nay',
    value: 19,
    from_date: moment().startOf('year').format(DATE_FORMAT),
    to_date: moment().format(DATE_FORMAT),
  },
];

const { from_date, to_date } = AccountingPeriodOptions.find((item) => item.value === 19) ?? {};
const DefaultFilter = {
  search: '',
  period: 19, // Năm nay
  is_merge: 0,
  view_previous_accounting: 1,
  type_account: 0,
  business_id: 0,
  page: 1,
  created_date_from: from_date,
  created_date_to: to_date,
  payment_form_id: null,
};

const BooleanOptions = [
  {
    label: 'Bật',
    value: 1,
  },
  {
    label: 'Tắt',
    value: 0,
  },
];

const TYPE_ACCOUNT = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Chi phí mua hàng', link_redirect: '/purchase-cost/detail' },
  { value: 2, label: 'Phiếu thu', link_redirect: '/receive-payment-slip' },
  { value: 3, label: 'Phiếu chi', link_redirect: '/receive-payment-slip' },
  { value: 4, label: 'Hóa đơn từ đơn mua hàng', link_redirect: '/purchase-orders/detail' },
  { value: 5, label: 'Chứng từ nghiệp vụ khác', link_redirect: '/other-voucher/detail' },
  { value: 6, label: 'Phiếu nhập kho', link_redirect: '/stocks-in-request/detail' },
  { value: 7, label: 'Phiếu xuất kho', link_redirect: '/stocks-out-request/detail' },
  { value: 8, label: 'Chuyển tiền nội bộ', link_redirect: '/internal-transfer/detail' },
  { value: 9, label: 'Hóa đơn ở đơn hàng bán', link_redirect: '/orders/detail' },
];

export { BooleanOptions, DefaultFilter, AccountingPeriodOptions, TYPE_ACCOUNT };
