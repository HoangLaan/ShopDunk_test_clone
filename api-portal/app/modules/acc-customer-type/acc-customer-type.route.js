const express = require('express');
const validate = require('express-validation');
const rules = require('./acc-customer-type.rule');
const crmAccCustomerTypeController = require('./acc-customer-type.controller');
const routes = express.Router();
const prefix = '/acc-customer-type';

// create crm acc_customer_type
// routes.route('')
//   .post(validate(rules.createAccCustomerType), crmAccCustomerTypeController.createAccCustomerType);
  
// Update crm acc_customer_type
routes.route('/:member_id(\\d+)')
  .put(validate(rules.updateAccCustomerType), crmAccCustomerTypeController.updateAccCustomerType);

// Detail a customer-type
routes.route('/:member_id(\\d+)')
  .get(crmAccCustomerTypeController.detailAccCustomerType);

// Delete crm acc_customer_type
// routes.route('/:member_id(\\d+)')
// .delete(crmAccCustomerTypeController.deleteAccCustomerType);

module.exports = {
    prefix,
    routes,
};