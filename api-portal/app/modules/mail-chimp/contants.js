const sendedList = []

module.exports = {
    RAW_MAIL_STATUS: {
        INVALID: 'invalid',
        REJECTED: 'rejected',
        QUEUED: 'queued',
        SCHEDULED: 'scheduled',
        SENT: 'sent',
    },
    MAIL_STATUS: {
        PROCESSING: 0,
        SUCCESS: 1,
        WAIT: 2,
        FAILD: 3,
    },
    EMAIL_LIST_TYPE: {
        PRESONAL: 1,
        LEAD: 2,
        PARNER: 3,
    },
    EMAIL_TYPE: {
        NORMAL: 1,
        SCHEDULE: 2,
    },
    sendedList
};
