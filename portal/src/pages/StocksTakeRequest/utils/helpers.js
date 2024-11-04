import { PROCESSING_STEP_TYPES, REVIEW_TYPES } from './constants';

const processStepTypes = [
  {
    label: 'Tất cả',
    value: PROCESSING_STEP_TYPES.ALL,
  },
  {
    label: 'Chưa xử lí',
    value: PROCESSING_STEP_TYPES.WAIT,
  },
  {
    label: 'Đã xử lí',
    value: PROCESSING_STEP_TYPES.DONE,
  },
];

const reviewTypes = [
  {
    label: 'Tất cả',
    value: REVIEW_TYPES.ALL,
  },
  {
    label: 'Đã duyệt',
    value: REVIEW_TYPES.APPROVED,
  },
  {
    label: 'Đang duyệt',
    value: REVIEW_TYPES.WAIT,
  },
  {
    label: 'Không duyệt',
    value: REVIEW_TYPES.REJECT,
  },
  {
    label: 'Chưa duyệt',
    value: REVIEW_TYPES.TOBE,
  },
];

export { processStepTypes, reviewTypes };
