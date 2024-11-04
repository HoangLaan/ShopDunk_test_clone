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
};

const paymentType = {
    CASH: 1,
    BANK: 2,
    PARTNER: 3,
    POS: 4,
};

module.exports = {
    orderType,
    paymentType,
};
