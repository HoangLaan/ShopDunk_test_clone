const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-care-type.rule');
const customerCareTypeController = require('./customer-care-type.controller');

const routes = express.Router();

const prefix = '/customer-care-type';

// List Customer care type
routes.route('').get(customerCareTypeController.getListCustomerCareType);

// List user
routes.route('/get-user').get(customerCareTypeController.getListUser);

// List options Department
routes.route('/get-department').get(customerCareTypeController.getDepartment);

// List options Position
routes.route('/get-position').get(customerCareTypeController.getPosition);

routes.route('/:id').get(customerCareTypeController.detailCustomerCareType);

// Create new a Customer care type
routes.route('').post(validate(rules.create), customerCareTypeController.createCustomerCareType);

// Update a Customer care type
routes.route('/:id').put(validate(rules.update), customerCareTypeController.updateCustomerCareType);

// Delete a Customer care type
routes.route('').delete(customerCareTypeController.deleteCustomerCareType);

// Detail a Customer care type

module.exports = {
    prefix,
    routes,
};
