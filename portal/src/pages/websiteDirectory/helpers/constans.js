import dayjs from 'dayjs';

export const defaultValueAdd = {
  booking_id: null,
  payment_status: 0,
  is_delivery_type: 1,
  store_id: 1,
  total_discount: 0,
  is_discount_percent: 0,
  is_active: 1,
  total_vat: 0,
  is_cash_money: 0,
  commissions: [],
  button_type: 'save',
  is_can_stockout: 1,
  is_can_collect_money: 1,
  is_can_create_receiveslip: 1,
  is_can_edit: 1,
  is_plus_point: 1,
  is_invoice: 1,
  receiving_date: dayjs().format('DD/MM/YYYY'),
  data_payment: [],
  return_money: 0,
  appointment_status: 1,
};

export const AppointmentStatus = {
  WAIT_CONFIRMATION: 1,
  CALLED: 2,
  PROCESSING: 3,
  COMPLETE: 4,
  CANCEL: 5,
  NO_REPLY: 6,
  PAUSE: 7,
};

export const AppointmentStatusOpts = [
  { value: AppointmentStatus.WAIT_CONFIRMATION, label: 'Chờ Duyệt' },
  { value: AppointmentStatus.CALLED, label: 'Đã Duyệt' },
  { value: AppointmentStatus.PROCESSING, label: 'Không Duyệt' },
];

export const CareService = {
  C_iphone: 11,
  C_mac: 12,
  C_ipad: 13,
};

export const CareServiceOpts = [
  { value: CareService.C_iphone, label: 'Thay pin Iphone' },
  { value: CareService.C_mac, label: 'Thay pin Mac' },
  { value: CareService.C_ipad, label: 'Thay pin Ipad' },
];

// export const approvaluser = {
//   0: 'Giao dịch thành công',
//   1: 'Ngân hàng từ chối cấp phép giao dịch',
// };

export const DELIVERY_STATUS = {
  NOT_YET: 1,
  IN_PROGRESS: 2,
  LATE: 3,
  COMPLETED_LATE: 4,
  COMPLETED_ON_TIME: 5,
};

export const FilterTabs = [
  {
    label: 'Tất cả',
    value: 1,
    status: 0,
  },
  {
    label: 'Đang tiến hàng',
    value: 2,
    status: DELIVERY_STATUS.IN_PROGRESS,
  },
  {
    label: 'Chưa bắt đầu',
    value: 3,
    status: DELIVERY_STATUS.NOT_YET,
  },
  {
    label: 'Trễ tiến độ',
    value: 4,
    status: DELIVERY_STATUS.LATE,
  },
  {
    label: 'Hoàn thành trễ tiến độ',
    value: 5,
    status: DELIVERY_STATUS.COMPLETED_LATE,
  },
  {
    label: 'Hoàn thành',
    value: 6,
    status: DELIVERY_STATUS.COMPLETED_ON_TIME,
  },
];

export const typePromotionValues = [
  {
    label: 'đ',
    value: 1,
  },
  {
    label: '%',
    value: 2,
  },
];
export const orderAddress = {
  STORE: 1,
  HOME: 2,
};

export const orderAddressOpts = [
  { label: 'Cửa hàng', value: orderAddress.STORE },
  { label: 'Tại nhà', value: orderAddress.HOME },
];

export const paymentFormType = {
  ALL: 0,
  CASH: 1,
  BANK: 2,
  PARTNER: 3,
  POS: 4,
};

export const paymentStatus = {
  ALL: -1,
  NOT_PAID: 0,
  PAID: 1,
  PARTIALLY_PAID: 2,
};

export const statusPaymentOpts = [
  { value: paymentStatus.ALL, label: 'Tất cả' },
  { value: paymentStatus.NOT_PAID, label: 'Chưa thanh toán' },
  { value: paymentStatus.PAID, label: 'Đã thanh toán' },
  { value: paymentStatus.PARTIALLY_PAID, label: 'Thanh toán 1 phần' },
];

export const vatExportStatus = {
  ALL: -1,
  EXPORTED: 1,
  NOT_EXPORTED: 0,
};

export const vatExportStatusOpts = [
  { value: vatExportStatus.ALL, label: 'Tất cả' },
  { value: vatExportStatus.EXPORTED, label: 'Đã xuất' },
  { value: vatExportStatus.NOT_EXPORTED, label: 'Chưa xuất' },
];

export const defaultValueFilter = {
  create_date_from: null,
  create_date_to: null,
  website_id: '',
  keyword: '',
  is_active: null,
};

export const orderType = {
  NORMAL: 1, // Đơn hàng tại quày
  INSTALLMENT_OFFLINE: 2, // Đơn hàng trả góp offline
  INSTALLMENT_ONLINE: 3, // Đơn hàng trả góp online
  SHOPEE: 4, // Đơn hàng Shopee
  LAZADA: 5, // Đơn hàng Lazada
  WEB: 6, // Đơn hàng bán trên web
  WHOLESALE_ORDERS: 7, // Đơn hàng bán buôn
  TRADE_IN: 8, // Đơn hàng thu cũ đổi mới
  PREORDER: 10, // Đơn hàng Preorder
  OTHER: 0, // Đơn hàng khác
  INTERNAL: 11, // Đơn nội bộ
};

export const INSTALLMENT_TYPE = {
  CARD: 1,
  COMPANY: 2,
};

export const orderTypeId = {
  RETAIL: 33, // Đơn hàng bán lẻ
  SD_PREORDER: 32, // Đơn hàng PreOrder từ App SD
  ERP_PREORDER: 31, // Đơn hàng PreOrder từ App ERP
  LDP_PREORDER: 30, // Đơn hàng PreOrder từ LDP
};

export const productOutputType = {
  RETAIL: 7, //Xuất bán lẻ
  PREORDER: 13, // Đơn hàng PreOrder
};
