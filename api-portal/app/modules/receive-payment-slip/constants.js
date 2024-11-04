module.exports = {
    // loai thu chi
    RECEIVE_EXPEND_TYPE: {
        RECEIVE_TYPE: 1,
        EXPEND_TYPE: 2,
    },
    PAYMENT_TYPE: {
        CASH: 1,
        CREDIT: 2,
    },
    BOOKKEEPING: {
        NOT_RECORDED: 0,
        RECORDED: 1,
    },
    REVEIEW_STATUS: [
        { value: 0, label: 'Không duyệt' },
        { value: 1, label: 'Đã duyệt' },
        { value: 2, label: 'Chưa duyệt' },
        { value: 3, label: 'Đang duyệt' },
    ],
    RECEIVER_TYPES: [
        { id: 1, name: 'Nhà cung cấp' },
        { id: 2, name: 'Nhân viên' },
        { id: 3, name: 'Khách hàng' },
        { id: 4, name: 'Khác' },
    ],
};
