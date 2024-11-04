const convertIsReview = (is_review) => {
    if (is_review == 1) {
        return 'Đã duyệt';
    } else if (is_review == 2) {
        return 'Đang duyệt';
    } else if (is_review == 3) {
        return 'Tự động duyệt';
    } else if (is_review == 4) {
        return 'Chờ duyệt';
    } else {
        return 'Không duyệt';
    }
};

const convertTimeHourMinutes = (inputTime) => {
    const [hour, minute] = inputTime.split(':').map(Number);

    // Sử dụng padStart để đảm bảo rằng giờ và phút đều có 2 chữ số
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');

    // Trả về chuỗi định dạng giờ HH:mm
    return `${formattedHour}:${formattedMinute}`;
};

module.exports = {
    convertIsReview,
    convertTimeHourMinutes,
};
