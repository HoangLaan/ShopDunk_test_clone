const express = require('express');
const controller = require('./payment-form.controller');
const prefix = '/payment-form';
const routes = express.Router();
// List by store
routes.route('/get-by-store').get(controller.getListByStore);
routes.route('/get-config').get(controller.getConfigPaymentForm);

module.exports = {
    prefix,
    routes,
};