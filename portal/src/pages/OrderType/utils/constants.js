export const TYPE = [
  {
    label: 'Đơn hàng bán tại quầy',
    value: 1,
    is_offline: 1,
  },
  {
    label: 'Đơn hàng trả góp',
    value: 2,
    is_offline: 1,
  },
  {
    label: 'Đơn hàng trả góp', // online
    value: 3,
    is_online: 1,
  },
  {
    label: 'Đơn hàng Shopee',
    value: 4,
    is_online: 1,
  },
  {
    label: 'Đơn hàng Lazada',
    value: 5,
    is_online: 1,
  },
  {
    label: 'Đơn hàng bán trên web',
    value: 6,
    is_online: 1,
  },
  {
    label: 'Đơn hàng bán buôn',
    value: 7,
    is_other: 1,
  },
  {
    label: 'Đơn hàng thu cũ đổi mới',
    value: 8,
    is_other: 1,
  },
  {
    label: 'Đơn hàng PreOrder',
    value: 10,
    is_other: 1,
  },
  {
    label: 'Đơn hàng khác ',
    value: 9,
    is_other: 1,
  },
  {
    label: 'Đơn hàng nội bộ',
    value: 11,
    is_other: 1,
  },
];

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
  {
    label: 'Mã đơn hàng (ORDERNO)',
    value: '<%= ORDERNO %>',
  },
  {
    label: 'Mã đặt cọc (PREORDERNO)',
    value: '<%= PREORDERNO %>',
  },
  {
    label: 'ID đặt cọc (PREORDERID)',
    value: '<%= PREORDERID %>',
  },
  {
    label: 'Tên sản phẩm (PRODUCTNAME)',
    value: '<%= PRODUCTNAME %>',
  },
  {
    label: 'Địa chỉ (RECEIVEADDRESS)',
    value: '<%= RECEIVEADDRESS %>',
  },
  {
    label: 'Địa chỉ ngắn gọn (SHORTRECEIVEADDRESS)',
    value: '<%= SHORTRECEIVEADDRESS %>',
  },
];
