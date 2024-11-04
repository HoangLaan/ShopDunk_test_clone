const moment = require('moment');

const checkIsOffDay = (input) => {
    // const weekdate = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
    const index = moment(input, 'DD/MM/YYYY').weekday();
    const date = moment(input, 'DD/MM/YYYY').date();
    return date % 2 == 0 && (index == 0 || index == 6);
}

const getTimeFromDate = (input) => {
    if(input){
        const dateParts = input.split(" "); // Tách chuỗi thành các phần tử
        // Lấy thời gian từ phần tử cuối cùng của mảng
        const time = dateParts[dateParts.length - 1]; // "11:08AM"
        // Loại bỏ "AM" hoặc "PM" nếu có
        const timeWithoutAmPm = time.replace(/(AM|PM)/, ''); // "11:08"
        if(time.includes('PM')){
            let [hours, minutes] = timeWithoutAmPm.split(':');
            hours = +hours + 12;
            return `${hours}:${minutes}:00`;
        }
        // Tạo chuỗi kết quả
        return `${timeWithoutAmPm}:00`;
    }else{
        return null
    }
    
}


module.exports = {
    checkIsOffDay,
    getTimeFromDate,
}