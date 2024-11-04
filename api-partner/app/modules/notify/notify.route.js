const express = require('express');
const validate = require('express-validation');
const notifyController = require('./notify.controller');
const routes = express.Router();
const rules = require('./notify.rule');
const prefix = '/notify';

routes.route('/send-sms').post(validate(rules.sendSMS), notifyController.sendSMS);
routes.route('/send-sms-voucher').post(validate(rules.sendSMSVoucher), notifyController.sendSMSVoucher);
routes.route('/send-sms-subscriber').post(validate(rules.sendSMSToSubscriber), notifyController.sendSMSToSubscriber);
routes.route('/send-zns-mini-game').post(validate(rules.sendZNSMiniGame), notifyController.sendZNSMiniGame);

module.exports = {
    prefix,
    routes,
};
