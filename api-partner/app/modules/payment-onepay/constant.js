const ONEPAY_INSTALLMENT = {
    MERCHANT_ID: process.env.ONEPAY_MERCHANT_ID,
    MERCHANT_KEY: process.env.ONEPAY_MERCHANT_KEY,
    HOST: process.env.ONEPAY_HOST,
    URI: process.env.ONEPAY_INSTALLMENT_URI,
};

const RESPONSE_MESSAGE = {
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

module.exports = {
    ONEPAY_INSTALLMENT,
    RESPONSE_MESSAGE,
};
