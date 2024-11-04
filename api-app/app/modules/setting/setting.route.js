const express = require('express');
const settingController = require('./setting.controller');
const routes = express.Router();
const prefix = '/setting';

routes.route('/biometric').put(settingController.updateBiometric);

routes.route('/push-notification').post(settingController.pushNotification);

module.exports = {
    prefix,
    routes,
};
