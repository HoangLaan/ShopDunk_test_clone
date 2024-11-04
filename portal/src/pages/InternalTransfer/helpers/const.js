export const TRANSFER_TYPE = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Chuyển cùng chi nhánh' },
  { value: 2, label: 'Chuyển khác chi nhánh' },
];

// Cần sửa lại description trong db để đồng nhất với tạo phiếu thu / chi
export const PAYMENT_TYPE = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Tiền mặt' },
  { value: 2, label: 'Chuyển khoản' },
];

export const CURRENCY_TYPE = [
  { value: 1, label: 'VND' },
  { value: 2, label: 'USD' },
];

export const REVIEW_STATUS = [
  { value: -1, label: 'Tất cả' },
  { value: 0, label: 'Chờ duyệt', color: '' },
  { value: 1, label: 'Đang duyệt', color: 'warning' },
  { value: 2, label: 'Đã duyệt', color: 'primary' },
  { value: 3, label: 'Không duyệt', color: 'danger' },
  { value: 4, label: 'Đang thực hiện', color: 'warning' }, // spent_money
  { value: 5, label: 'Hoàn thành', color: 'primary' }, // complete_status
];

export const SLIP_TYPE = {
  1: 'Phiếu thu',
  2: 'Phiếu chi',
};

export const SLIP_REVIEW_STATUS = [
  { value: 0, label: 'Không duyệt', color: 'danger' },
  { value: 1, label: 'Đã duyệt', color: 'success' },
  { value: 2, label: 'Chưa duyệt', color: 'warning' },
  { value: 3, label: 'Đang duyệt', color: 'primary' },
];

export const STATUS_RECEIVE_MONEY = [
  { value: -1, label: 'Tất cả' },
  { value: 0, label: 'Chưa xác nhận', color: 'danger' },
  { value: 1, label: 'Đã xác nhận', color: 'success' },
];
