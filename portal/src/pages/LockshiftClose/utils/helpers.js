import { MEASURE, CRITERIA, VALUE_UNIT } from './constants';

const measureOptions = [
  {
    label: 'Tỷ lệ',
    value: MEASURE.PERCENT,
  }
];

const criteriaOptions = [
  {
    label: 'Doanh thu',
    value: CRITERIA.REVENE,
  },
  {
    label: 'Lợi nhuận',
    value: CRITERIA.PROFIT,
  },
  {
    label: 'Số lượng đơn hàng',
    value: CRITERIA.NO_ORDERS,
  }
]

const valueUnitOptions = [
  {
    label: '%',
    value: VALUE_UNIT.PERCENT,
  },
  {
    label: 'đ',
    value: VALUE_UNIT.VND,
  },
  {
    label: '-',
    value: VALUE_UNIT.NULL,
  }
]



export { measureOptions, criteriaOptions, valueUnitOptions };
