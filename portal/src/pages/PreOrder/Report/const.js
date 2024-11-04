export const reportType = [
  // {
  //   label: 'IP 11 (Đã mua IP 14)',
  //   value: 1,
  //   type: 'IP11',
  //   is_update_14: true,
  //   is_buy_accessory: false,
  // },
  {
    label: 'IP 12 (Đã mua IP 14)',
    value: 2,
    type: 'IP12',
    is_update_14: true,
    is_buy_accessory: false,
  },
  {
    label: 'IP 13 (Đã mua IP 14)',
    value: 3,
    type: 'IP13',
    is_update_14: true,
    is_buy_accessory: false,
  },
  {
    label: 'IP 14',
    value: 4,
    type: 'IP14',
    is_update_14: true,
    is_buy_accessory: false,
  },
  // {
  //   label: 'IP 11 (Chưa mua IP 14)',
  //   value: 5,
  //   type: 'IP11',
  //   is_update_14: false,
  //   is_buy_accessory: false,
  // },
  {
    label: 'IP 12 (Chưa mua IP 14)',
    value: 6,
    type: 'IP12',
    is_update_14: false,
    is_buy_accessory: false,
  },
  {
    label: 'IP 13 (Chưa mua IP 14)',
    value: 7,
    type: 'IP13',
    is_update_14: false,
    is_buy_accessory: false,
  },
  {
    label: 'IP 14 (Kèm phụ kiện)',
    value: 8,
    type: 'IP14',
    is_update_14: false,
    is_buy_accessory: true,
  },
  {
    label: 'IP 14 (Tiềm năng)',
    value: 9,
    type: 'IP14TN',
    is_update_14: false,
    is_buy_accessory: false,
  },
];

export const reportBuyIp15 = {
  total: {
    key: 'total',
    label: 'Đã thanh toán hết',
    value: 1,
    classActive: 'bw_btn_primary',
    classNone: 'bw_btn_outline bw_btn_outline_primary',
  },
  total_part_paid: {
    key: 'total_part_paid',
    label: 'Đã thanh toán 1 phần',
    value: 2,
    classActive: 'bw_btn_warning',
    classNone: 'bw_btn_outline bw_btn_outline_warning',
  },
  total_stop: {
    key: 'total_stop',
    label: 'Chưa thanh toán',
    value: 0,
    classActive: 'bw_btn_danger',
    classNone: 'bw_btn_outline bw_btn_outline_danger',
  },
};
