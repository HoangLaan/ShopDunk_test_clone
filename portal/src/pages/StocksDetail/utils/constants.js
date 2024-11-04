import moment from 'moment';

export const CALCULATE_METHODS = {
  FIRST_IN_FIRST_OUT: 1,
  PREIODICAVCO: 2,
  CONTINUOSAVCO: 3,
  SPECIFIC_IDENTIFICATION_METHODL: 4,
};

export const CALCULATE_METHODS_OPTIONS = [
  // { value: CALCULATE_METHODS.FIRST_IN_FIRST_OUT, label: 'Nhập trước xuất trước' },
  { value: CALCULATE_METHODS.PREIODICAVCO, label: 'Bình quân gia quyền cuối kỳ' },
  { value: CALCULATE_METHODS.CONTINUOSAVCO, label: 'Bình quân gia quyền mỗi lần nhập' },
  // { value: CALCULATE_METHODS.SPECIFIC_IDENTIFICATION_METHODL, label: 'Phương pháp đích danh' },
];

export const goodsCalculate = [{ field: 'need_calculate_goods' }, { field: 'choose_calculate_goods' }];

const DATE_FORMAT = 'DD/MM/YYYY';

export const DateOptions = [
  {
    label: 'Hôm nay',
    value: 1,
    from_date: moment().format(DATE_FORMAT),
    to_date: moment().format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tuần này',
    value: 2,
    from_date: moment().startOf('week').format(DATE_FORMAT),
    to_date: moment().endOf('week').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 1',
    value: 3,
    from_date: moment().startOf('year').month(0).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(0).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 2',
    value: 4,
    from_date: moment().startOf('year').month(1).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(1).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 3',
    value: 5,
    from_date: moment().startOf('year').month(2).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(2).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 4',
    value: 6,
    from_date: moment().startOf('year').month(3).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(3).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 5',
    value: 7,
    from_date: moment().startOf('year').month(4).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(4).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 6',
    value: 8,
    from_date: moment().startOf('year').month(5).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(5).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 7',
    value: 9,
    from_date: moment().startOf('year').month(6).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(6).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 8',
    value: 10,
    from_date: moment().startOf('year').month(7).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(7).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 9',
    value: 11,
    from_date: moment().startOf('year').month(8).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(8).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 10',
    value: 12,
    from_date: moment().startOf('year').month(9).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(9).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 11',
    value: 13,
    from_date: moment().startOf('year').month(10).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(10).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Tháng 12',
    value: 14,
    from_date: moment().startOf('year').month(11).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(11).endOf('month').format(DATE_FORMAT),
    period: 1,
  },
  {
    label: 'Quý 1',
    value: 15,
    from_date: moment().startOf('year').month(0).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(2).endOf('month').format(DATE_FORMAT),
    period: 2,
  },
  {
    label: 'Quý 2',
    value: 16,
    from_date: moment().startOf('year').month(3).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(5).endOf('month').format(DATE_FORMAT),
    period: 2,
  },
  {
    label: 'Quý 3',
    value: 17,
    from_date: moment().startOf('year').month(6).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(8).endOf('month').format(DATE_FORMAT),
    period: 2,
  },
  {
    label: 'Quý 4',
    value: 18,
    from_date: moment().startOf('year').month(9).format(DATE_FORMAT),
    to_date: moment().startOf('year').month(11).endOf('month').format(DATE_FORMAT),
    period: 2,
  },
  {
    label: 'Năm nay',
    value: 19,
    from_date: moment().startOf('year').format(DATE_FORMAT),
    to_date: moment().endOf('year').format(DATE_FORMAT),
    period: 3,
  },
];

export const PeriodOptions = [
  {
    label: 'Tháng',
    value: 1,
  },
  {
    label: 'Quý',
    value: 2,
  },
  {
    label: 'Năm',
    value: 3,
  },
];

export const DATA_DEFAULT = {
  choose_calculate_goods: 1,
  calculate_method: 3,
  calculate_according_stocks: 1,
  all_days: 1,
};
