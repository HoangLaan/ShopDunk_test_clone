const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-type.rule');
const customerTypeController = require('./customer-type.controller');
const routes = express.Router();
const prefix = '/customer-type';

// List customer-type
routes.route('').get(customerTypeController.getListCustomerType);
// create a customer-type
routes.route('').post(validate(rules.createCustomerType), customerTypeController.createCustomerType);
// Change status a customer-type
routes
    .route('/:customer_type_id(\\d+)/change-status')
    .put(validate(rules.changeStatusCustomerType), customerTypeController.changeStatusCustomerType);
// Update a customer-type
routes
    .route('/:customer_type_id(\\d+)')
    .put(validate(rules.updateCustomerType), customerTypeController.updateCustomerType);

// Delete a customer-type
routes.route('').delete(customerTypeController.deleteCustomerType);

// Detail a customer-type
routes.route('/:customer_type_id(\\d+)').get(customerTypeController.detailCustomerType);

// List options customer-type
routes.route('/get-options').get(customerTypeController.getOptions);

module.exports = {
    prefix,
    routes,
};
