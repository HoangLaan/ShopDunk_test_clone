const Queue = require('bull')
const QUEUE_CONST = require('../const/queue.const');

const CONFIG = {
    redis: {
        host: '27.71.232.204',
        port: 6380,
        password: 'BlackwindTeam@151',
        connectTimeout: 30000
    }
}

const mail = new Queue(QUEUE_CONST.MAIL, CONFIG);
const notification = new Queue(QUEUE_CONST.NOTIFICATION, CONFIG)

module.exports = {
    mail, notification
}