const responseCodes = {
    100: 'Request được gửi đến ViHAT thành công.',
    101: 'Sai thông tin ApiKey hoặc SecretKey.',
    102: 'Không có bảng giá.',
    103: 'Không đủ số dư để gửi tin.',
    105: 'Không tìm thấy mã tin nhắn/ Mã cuộc gọi trên hệ thống.',
    106: 'File ghi âm không tồn tại.',
    107: 'Mỗi request phải có ít nhất 30 số mới được duyệt.',
    124: 'Trùng RequestId khi gửi tin.',
    146: 'Sai template chăm sóc khách hàng.',
    177: 'Nhà mạng chưa được đăng ký.',
    789: 'Template chưa được cấu hình cho OA ID bạn đang sử dụng.',
    791: 'Thiếu OA ID hoặc Template ID.',
    790: 'Sai template ZNS.',
    799: 'OAID không active - OAID Sai - OAID chưa được add vào tài khoản.',
    300: 'Thiếu loại tin nhắn.',
    204: 'OAID không tồn tại trên hệ thống.',
    171: 'Mã đã được sử dụng, mã hết hạn hoặc mã không áp dụng cho số điện thoại cần check.',
    120: 'Danh sách số điện thoại gửi tin vượt quá giới hạn.',
    210: 'Không đúng payload theo quy định',
};

module.exports = responseCodes;
