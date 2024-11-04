const STATUS = {
    ORDER: [
        {value: 0, label:'Đơn hàng mới', is_create: 1},
        {value: 1, label:'Đang xử lý', is_processing: 1},
        {value: 2, label:'Hoàn thành', is_complete: 1},
        {value: 3, label:'Hủy', is_cancel: 1},
    ],
    PAYMENT: [
        {value: 0, label:'Chưa thanh toán'},
        {value: 1, label:'Đã thanh toán'},
    ],
}

module.exports = {
    STATUS
}