const express = require('express');
const validate = require('express-validation');
const controller = require('./payment-form.controller');
const routes = express.Router();
const prefix = '/payment-form';
const rules = require('./payment-form.rule');

routes.route('/get-by-store/:store_id(\\d+)').get(controller.getListByStore);

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getPaymentFormList)
    .post(validate(rules.createPaymentForm), controller.createPaymentForm)
    .put(validate(rules.updatePaymentForm), controller.updatePaymentForm)
    .delete(controller.deletePaymentForm);

// Get detail
routes.route('/:payment_form_id(\\d+)').get(controller.paymentFormDetail);

// Get options
routes.route('/options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
