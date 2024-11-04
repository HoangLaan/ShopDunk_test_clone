export const REQUEST_CODE_TYPES = {
  ISPURCHASE: 1,
  ISINVENTORYCONTROL: 2,
  ISEXCHANGEGOODS: 3,
  ISTRANSFER: 4,
  ISWARRANTY: 5,
  ISCOMPONENT: 6,
  ISINTERNAL: 7,
};
export const REVIEW_TYPE = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
};

export const REVIEW_STATUS_TYPES = {
  NOREVIEW: 0,
  REVIEWED: 1,
  NOTYETREVIEW: 2,
  REVIEWING: 3,
  ALL: 4,
};

export const reviewStatusOption = [
  {
    label: 'Tất cả',
    value: REVIEW_STATUS_TYPES.ALL,
  },
  {
    label: 'Đã duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWED,
  },
  {
    label: 'Chưa duyệt',
    value: REVIEW_STATUS_TYPES.NOTYETREVIEW,
  },
  {
    label: 'Đang duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWING,
  },
  {
    label: 'Không duyệt',
    value: REVIEW_STATUS_TYPES.NOREVIEW,
  },
];

export const ToastStyle = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const reviewTypeOptions = [
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

export const objTotalProductStRequest = {
  total_quantity: 0,
  total_cost_price: 0,
  total_total_price: 0,
  tax_account: 0,
  total_vat_value: 0,
  total_vat_money: 0,
  total_total_cost_price: 0,
  total_total_cost_basic_imei: 0,
};

export const DEFENDKEYSUM = 'total_';

export const STOCKINTYPEID = 9 //Nhập hàng mới
export const ISIMPORTED = 1 //Nhập hàng mới