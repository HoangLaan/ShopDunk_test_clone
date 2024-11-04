import { OUTPUT_TYPE, REVIEW_TYPE } from './constants';

const outTypeOptions = [
  {
    label: 'Tất cả',
    value: OUTPUT_TYPE.ALL,
  },
  {
    label: 'Đã xuất kho',
    value: OUTPUT_TYPE.OUT,
  },
  {
    label: 'Chưa xuất kho',
    value: OUTPUT_TYPE.NON,
  },
];

const reviewTypeOptions = [
  {
    label: 'Chưa duyệt',
    colorLabel: 'bw_black',
    className: '',
    icon: 'fi-rr-minus',
    value: REVIEW_TYPE.PENDING,
  },
  {
    label: 'Đã duyệt',
    colorLabel: 'bw_green',
    className: 'bw_agree',
    icon: 'fi-rr-check',
    value: REVIEW_TYPE.ACCEPT,
  },
  {
    label: 'Không duyệt',
    colorLabel: 'bw_red',
    className: 'bw_non_agree',
    icon: 'fi-rr-minus',
    value: REVIEW_TYPE.REJECT,
  },
];

export { outTypeOptions, reviewTypeOptions };
