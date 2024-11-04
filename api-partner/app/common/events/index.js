const events = require('events');
const mailHelper = require('../helpers/mail.helper');

const eventsEmitter = new events.EventEmitter();
eventsEmitter.on('send-email', mailHelper.send);
module.exports = eventsEmitter;
