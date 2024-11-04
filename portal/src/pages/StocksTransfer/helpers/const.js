import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const statusTransferOpts = [
  { value: 1, label: 'Đã hủy' },
  { value: 2, label: 'Đã xuất kho' },
  { value: 3, label: 'Đã nhập kho' },
  { value: 4, label: 'Phiếu chuyển kho có vấn đề' },
  { value: 5, label: 'Phiếu chuyển kho mới' },
];

export const defaultValues = {
  is_active: 1,
  status_transfer: 5,
  created_date: dayjs().format('DD/MM/YYYY'),
  product_transfer: null,
  is_can_edit: 1,
  reviewed_status: 2,
  is_can_transfer: 0,
};

export const TRANSFER_TYPE = {
  OTHER: 0,
  INTERNAL_STORE: 1,
  SAME_BUSINESS: 2,
  DIFF_BUSINESS: 3,
  ORIGIN_STOCKS: 4,
  ORIGIN_STOCKS_TO_BUSINESS: 5,
  BUSINESS_TO_ORIGIN_STOCKS: 6,
};

export const TransferTypeOptions = [
  {
    label: 'Chuyển kho nội bộ cửa hàng',
    value: TRANSFER_TYPE.INTERNAL_STORE,
  },
  {
    label: 'Chuyển kho cùng chi nhánh/tỉnh',
    value: TRANSFER_TYPE.SAME_BUSINESS,
  },
  {
    label: 'Chuyển kho khác chi nhánh/tỉnh',
    value: TRANSFER_TYPE.DIFF_BUSINESS,
  },
  {
    label: 'Chuyển kho giữa các kho Tổng',
    value: TRANSFER_TYPE.ORIGIN_STOCKS,
  },
  {
    label: 'Chuyển kho đi từ kho Tổng đến chi nhánh/tỉnh',
    value: TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS,
  },
  {
    label: 'Chuyển kho từ Chi nhánh về Kho Tổng',
    value: TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS,
  },
];

export const TransportPartner = [
  { label: 'Ahamove ', value: 'Ahamove ' }, 
  { label: '247 Express ', value: '247 Express' },
  { label: 'Nhất Tín', value: 'Nhất Tín' },
  { label: 'Nhân viên đi ship', value: 'Nhân viên đi ship' },
  { label: 'Ship Khác', value: 'Ship Khác' },
];

export const DELIVERY_STATUS = {
  NOT_YET: 1,
  IN_PROGRESS: 2,
  LATE: 3,
  COMPLETED_LATE: 4,
  COMPLETED_ON_TIME: 5,
};
