const Queue = require('bull')
const QUEUE_CONST = require('../const/queue.const');

const CONFIG = {
    redis: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PWD,
        connectTimeout: 30000
    }
}

const mail = new Queue(QUEUE_CONST.MAIL, CONFIG);
const notification = new Queue(QUEUE_CONST.NOTIFICATION, CONFIG)

module.exports = {
    mail, notification
}