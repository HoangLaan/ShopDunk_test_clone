const moment = require('moment');

const getCurrentDateTime = () => (
    moment().seconds(0).utc().toISOString()
);

const formatDateTimeWithUTC = (datetime) => {
    moment(datetime).format('LLLL UTC');
};

module.exports = {
    getCurrentDateTime,
    formatDateTimeWithUTC,
};
