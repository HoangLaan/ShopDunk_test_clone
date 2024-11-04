const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-working.rule');
const customerWorkingController = require('./customer-working.controller');
const routes = express.Router();
const prefix = '/customer-working';

routes.route('')
  .get(customerWorkingController.getList)
  .post(validate(rules.createCustomerWorking), customerWorkingController.createOrUpdate)
  .delete(customerWorkingController.deleteTask);

// Get store by user
routes.route('/get-store-user')
  .get(customerWorkingController.getStoreByUser);

// Get by id
routes.route('/:customerWorkingId(\\d+)')
  .get(customerWorkingController.getById);

// Update by id
routes.route('/:customerWorkingId')
  .put(validate(rules.createCustomerWorking), customerWorkingController.createOrUpdate);

module.exports = {
  prefix,
  routes,
};
