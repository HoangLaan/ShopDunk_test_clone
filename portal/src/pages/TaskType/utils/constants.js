export const PERMISSION = {
  ADD: 'TASKTYPE_ADD',
  EDIT: 'TASKTYPE_EDIT',
  VIEW: 'TASKTYPE_VIEW',
  DEL: 'TASKTYPE_DEL',
  IMPORT: 'TASKTYPE_IMPORT',
  EXPORT: 'TASKTYPE_EXPORT',
  ADD_CONDITION: 'TASKTYPE_ADD_CONDITION',
  DEL_CONDITION: 'TASKTYPE_DEL_CONDITION',
};

export const MODAL = {
  IMPORT: 'bw_modal_task_type_import',
  IMPORT_ERROR: 'bw_modal_task_type_import_error',
  USER_CARE: 'bw_modal_task_type_user_care',
  CONDITION: 'bw_modal_task_workflow_condition',
};

export const TYPE_TIME_NOT_BUYING = {
  DAY: 1,
  MONTH: 2,
  YEAR: 3,
};

export const TYPE_TIME_NOT_BUYING_OPTIONS = [
  { value: TYPE_TIME_NOT_BUYING.DAY, label: 'Ngày' },
  { value: TYPE_TIME_NOT_BUYING.MONTH, label: 'Tháng' },
  { value: TYPE_TIME_NOT_BUYING.YEAR, label: 'Năm' },
];

export const DIVIDE_BY = {
  IS_EQUAL_DIVIDE: 1, // Chia đều
  IS_RATIO_DIVIDE: 2, // Chia theo tỷ lệ %
  IS_GET_DATA: 3, // Nhận data
};

export const SMS_TEMPLATE_FIELDS = [
  {
    label: 'Sinh nhật (BIRTHDAY)',
    value: '<%= BIRTHDAY %>',
  },
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: '<%= FULLNAME %>',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: '<%= PHONENUMBER %>',
  },
  {
    label: 'Email (EMAIL)',
    value: '<%= EMAIL %>',
  },
];

export const WFLOW_REPEAT_TYPE = {
  WEEK: 1,
  MONTH: 2,
  YEAR: 3,
};

export const WFLOW_REPEAT_TYPE_OPTIONS = [
  { value: WFLOW_REPEAT_TYPE.WEEK, label: 'Hàng tuần' },
  { value: WFLOW_REPEAT_TYPE.MONTH, label: 'Hàng tháng' },
  { value: WFLOW_REPEAT_TYPE.YEAR, label: 'Hàng năm' },
]
