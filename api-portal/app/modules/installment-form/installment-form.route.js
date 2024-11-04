const express = require('express');
const validate = require('express-validation');
const controller = require('./installment-form.controller');
const routes = express.Router();
const rules = require('./installment-form.rule');
const prefix = '/installment-form';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

// Get detail
routes.route('/:installment_form_id(\\d+)').get(controller.detail);

routes.route('/option').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
