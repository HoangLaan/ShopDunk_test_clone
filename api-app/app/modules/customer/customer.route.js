const express = require('express');
const validate = require('express-validation');
const customerController = require('./customer.controller');

const rules = require('./customer.rule');
const prefix = '/customer';
const routes = express.Router();
// List
routes.route('').get(customerController.getListCustomer);
routes.route('/personal').get(customerController.getListCustomerPersonal);
// Create or update customer
routes.route('').post(validate(rules.createOrUpdate), customerController.createOrUpdateCustomer);
// Get list purchase history
routes.route('/purchase-history').get(customerController.getPurchaseHistory);
routes.route('/task-history').get(customerController.getTaskHistory);
routes.route('/detail').get(customerController.getDetail);

// Get source options
routes.route('/source-options').get(customerController.getSourceOptions);

module.exports = {
    prefix,
    routes,
};
