const express = require('express');
const validate = require('express-validation');
const controller = require('./purchase-invoice.controller');
const routes = express.Router();
const rules = require('./purchase-invoice.rule');
const prefix = '/purchase-invoice';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update);

// Get detail
routes.route('/:invoice_id(\\d+)').get(controller.detail);

routes.route('/cancel/:invoice_id(\\d+)').put(controller.cancelInvoie);

module.exports = {
    prefix,
    routes,
};
