const ERROR_MESSAGES = {
    '001': 'Khuyến mãi áp dụng cùng nhau không hợp lệ',
    '002': 'Lỗi thêm mã giảm giá trong đơn hàng',
    '003': 'IMEI : {imei_code}-{product_code}-{product_name} đã xuất kho!',
    '004': 'Lỗi thêm sản phẩm trong đơn hàng',
    '005': 'Lỗi thêm túi bao bì trong đơn hàng',
    '006': 'Lỗi lưu nhân viên nhận hoa hồng.',
    '007': 'IMEI : {imei_code}-{product_code}-{product_name} tồn tại ở đơn hàng {order_no}!',
    '008': 'Lỗi thêm quà tặng trong đơn hàng',
    '009': 'Thêm mới khuyến mãi thất bại.',
    '010': 'Thêm mới khuyến mãi thất bại.',
    '011': 'Lỗi lấy loại thu của phiếu thu trong đơn hàng !',
    '012': 'Đơn hàng {orderNo} đã thu đủ tiền.',
    '013': 'Tạo phiếu thu với đơn hàng thất bại',
    '014': 'Lưu hình thức thanh toán đơn hàng thất bại',
};

const orderType = {
    OFFLINE: 1, // Đơn hàng offline
    ONLINE: 2, // Đơn hàng online
    WHOLESALE: 3, // Đơn hàng bán buôn
    INSTALLMENT: 4, // Đơn hàng trả góp
    TRADE_IN: 5, // Đơn hàng thu cũ đổi mới
    SHOPEE: 6, // Đơn hàng Shopee
    EXCHANGE: 7, // Đơn hàng đổi
    RETURN: 8, // Đơn hàng trả
    LAZADA: 9, // Đơn hàng Lazada
    PREORDER: 10, // Đơn hàng Preorder
    OTHER: 0, // Đơn hàng khác
    INTERNAL: 11, // Đơn hàng nội bộ
};

const PAYMENT_STATUS = {
    UNPAID: 0,
    PAID: 1,
    PARTIALLY_PAID: 2,
};

const PAYMENT_TYPE = {
    CASH: 1,
    BANK: 2,
    PARTNER: 3,
};

module.exports = {
    ERROR_MESSAGES,
    orderType,
    PAYMENT_STATUS,
    PAYMENT_TYPE,
};
