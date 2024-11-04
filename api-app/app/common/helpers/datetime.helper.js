const moment = require('moment');

const getCurrentDateTime = () => (
    moment().seconds(0).utc().toISOString()
);

const formatDateTimeWithUTC = (datetime) => {
    moment(datetime).format('LLLL UTC');
};

const padLeadingZeros = (num, size, char = '0') => {
    let s = String(num);
    while (s.length < size) s = char + s;
    return s;
}

const convertTime = (hourStart, minuteStart, hourEnd, minuteEnd) => {
    const startTime = padLeadingZeros(hourStart, 2) + ":" + padLeadingZeros(minuteStart, 2);
    const endTime = padLeadingZeros(hourEnd, 2) + ":" + padLeadingZeros(minuteEnd, 2);
    return startTime + " - " + endTime;
};

module.exports = {
    getCurrentDateTime,
    formatDateTimeWithUTC,
    convertTime
};
