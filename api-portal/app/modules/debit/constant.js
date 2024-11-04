const DEBIT_STATUS = {
    NONE: 0,
    DONE: 1,
    NOT_EXPIRED: 2,
    EXPIRED: 3,
    DONE_BUT_EXPIRED: 4,
};

const DEBIT_STATUS_EXPORT = {
    1: 'Hoàn thành',
    2: 'Chưa quá hạn',
    3: 'Đã quá hạn',
    4: 'Hoàn thành trễ hạn',
};

const DEBIT_TYPE = {
    1: 'Thu',
    2: 'Trả',
};

module.exports = {
    DEBIT_STATUS,
    DEBIT_STATUS_EXPORT,
    DEBIT_TYPE
};
