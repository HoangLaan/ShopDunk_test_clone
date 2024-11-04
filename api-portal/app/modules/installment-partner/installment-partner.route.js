const express = require('express');
const validate = require('express-validation');
const controller = require('./installment-partner.controller');
const routes = express.Router();
const rules = require('./installment-partner.rule');
const prefix = '/installment-partner';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

// Get detail
routes.route('/:installment_partner_id(\\d+)').get(controller.detail);

// get code
routes.route('/gen-code').get(controller.genCode);

// get options
routes.route('/options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
