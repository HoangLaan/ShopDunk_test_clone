const express = require('express');
const validate = require('express-validation');
const notifyController = require('./notify.controller');
const routes = express.Router();
const rules = require('./notify.rule');
const prefix = '/notify';

routes.route('/send-sms').post(validate(rules.sendSMS), notifyController.sendSMS);
routes.route('/send-sms-adv').post(validate(rules.sendAdv), notifyController.sendAdv);

//get list notify with user, not read
routes.route('').get(notifyController.getListNotify);

routes.route('/read').post(validate(rules.read), notifyController.updateReadNotify);
routes.route('/many-read').get(notifyController.updateReadAllNotify);

module.exports = {
    prefix,
    routes,
};
