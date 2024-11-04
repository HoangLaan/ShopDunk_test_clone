import dayjs from 'dayjs';

export const defaultValueAdd = {
  order_id: null,
  payment_status: 0,
  is_delivery_type: 1,
  order_source: 1,
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
};

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
  search: '',
  date_from: null,
  date_to: null,
  store_id: null,
  company_id: null,
  order_type: null,
  payment_status: paymentStatus.ALL,
  vat_export_status: vatExportStatus.ALL,
  page: 1,
  order_type_id: 33,
  business_id: null,
  store: null,
  is_delivery_type: null,
  provice_id: null,
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

export const InstallmentTypeOptions = [
  { label: 'Qua công ty tài chính', value: 2 },
  // { label: 'Qua thẻ tín dụng', value: 1 },
  // { label: 'Qua công ty tài chính', value: 2 },
];

export const INSTALLMENT_PAYMENT_METHODS = [
  {
    label: 'Onepay',
    value: 1,
    logo: 'https://play-lh.googleusercontent.com/mvedVCbQg6ADKUYYraVLOlmOfOy2Rz66kEPvbmxt5xZ2TTa90Go9jBD2dJrwWmEo5g8',
  },
  { label: 'Payoo', value: 2, logo: 'https://cdn.tgdd.vn/2020/06/GameApp/payoo-1-200x200.jpg' },
  {
    label: 'Kredivo',
    value: 3,
    logo: 'https://yt3.googleusercontent.com/0J7KUb-ZLoJTgeikh1v44xYLtmCfRn8gNmNEUTTmFJQju2aZJVEfRXLnzKMhmBVt_S08T4tgQQ=s900-c-k-c0x00ffffff-no-rj',
  },
];

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

export const ONEPAY_RESPONSE_MESSAGE = {
  0: 'Giao dịch thành công',
  1: 'Ngân hàng từ chối cấp phép giao dịch',
  2: 'Ngân hàng phát hành thẻ từ chối cấp phép giao dịch',
  3: 'Không nhập được kết quả phản hồi từ Tổ chức phát hành thẻ',
  4: 'Tháng/Năm hết hạn của thẻ không đúng hoặc thẻ đã hết hạn sử dụng',
  5: 'Số dư/Hạn mức của thẻ không đủ để thanh toán',
  6: 'Không nhận được kết quả phản hồi từ Tổ chức phát hành thẻ',
  7: 'Lỗi trong quá trình xử lý giao dịch của Ngân hàng',
  8: 'Ngân hàng phát hành thẻ không hỗ trợ thanh toán trực tuyến',
  9: 'Tên chủ thẻ/tài khoản không hợp lệ',
  10: 'Thẻ hết hạn/Thẻ bị khóa',
  11: 'Thẻ/Tài khoản chưa đăng ký dịch vụ hỗ trợ thanh toán trực tuyến',
  12: 'Tháng/Năm phát hành hoặc hết hạn của thẻ không hợp lệ',
  13: 'Giao dịch vượt quá hạn mức thanh toán trực tuyến theo quy định của Ngân hàng',
  14: 'Số thẻ không hợp lệ',
  21: 'Số dư tài khoản không đủ để thanh toán',
  22: 'Thông tin tài khoản không hợp lệ',
  23: 'Thẻ/Tài khoản bị khóa hoặc chưa được kích hoạt',
  24: 'Thông tin thẻ/tài khoản không hợp lệ',
  25: 'Mã xác thực OTP không hợp lệ',
  26: 'Mã xác thực OTP đã hết hiệu lực',
  98: 'Xác thực giao dịch bị hủy',
  99: 'Người dùng hủy giao dịch',
  B: 'Lỗi trong quá trình xác thực giao dịch của Ngân hàng phát hành thẻ',
  D: 'Lỗi trong quá trình xác thực giao dịch của Ngân hàng phát hành thẻ',
  F: 'Xác thực giao dịch không thành công',
  U: 'Xác thực mã CSC không thành công',
  Z: 'Giao dịch bị từ chối',
  253: 'Hết thời hạn nhập thông tin thanh toán',
};
