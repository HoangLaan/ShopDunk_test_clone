import { MARITAL_STATUS, USER_STATUS } from './constants';

export const userStatus = [
  {
    label: 'Đang làm việc',
    value: USER_STATUS.WORKING,
  },
  {
    label: 'Nghỉ thai sản',
    value: USER_STATUS.MATERNITY_LEAVE,
  },
  {
    label: 'Đã nghỉ việc',
    value: USER_STATUS.QUIT_JOB,
  },
];

export const maritalStatus = [
  {
    label: 'Độc thân',
    value: MARITAL_STATUS.SINGLE,
  },
  {
    label: 'Đã kết hôn',
    value: MARITAL_STATUS.MARRIED,
  },
];
