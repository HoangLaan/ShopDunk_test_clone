


export const DefaultFilter = {
  search: '',
  is_active: 1,
  installment_partner_id: null,
};

export const DefaultValue = {
  is_active: 1,
  is_system: 0,
};

export const TYPE_TASK = {
  ALL: 0,
  JOB_SHOP: 101,
  CALL_CUSTOMER: 2,
};

export const TYPE_TASK_OPTION = [
  {
    label: 'Tất cả',
    value: TYPE_TASK.ALL,
  },
  {
    label: 'Công việc phân xuống shop',
    value: TYPE_TASK.JOB_SHOP,
  },
  {
    label: 'Gọi điện chăm sóc khách hàng',
    value: TYPE_TASK.CALL_CUSTOMER,
  },
]


export const TYPE_OPTIONS = {
  ALL: 0,
  S_1: 1,
  S_2: 2,
  S_3: 3,
  S_4_1: 4,
  S_4_2: 5,
  S_5_1: 6,
  S_5_2: 7,
}

export const IS_TYPE_STATUS = [
  {
    label: 'Tất cả',
    value: TYPE_OPTIONS.ALL,
  },
  {
    label: 'S1 (KH quan tâm sp, có nhu cầu tìm hiểu mua)',
    value: TYPE_OPTIONS.S_1,
  },
  {
    label: 'S2 (KH cho thông tin)',
    value: TYPE_OPTIONS.S_2,
  },
  {
    label: 'S3 ( KH qua shop)',
    value: TYPE_OPTIONS.S_3,
  },
  {
    label: 'S4.1 (đã mua online)',
    value: TYPE_OPTIONS.S_4_1,
  },
  {
    label: 'S4.2 (đã mua tại shop)',
    value: TYPE_OPTIONS.S_4_2,
  },
  {
    label: 'S5.1 (không qua shop, k mua hàng)',
    value: TYPE_OPTIONS.S_5_1,
  },
  {
    label: 'S5.2 (qua shop, không mua)',
    value: TYPE_OPTIONS.S_5_2,
  },
];

