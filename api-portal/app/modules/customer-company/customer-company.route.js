const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-company.rule');
const CompannyRules = require('./customer-company-type.rule');
const customerCompanyController = require('./customer-company.controller');
const routes = express.Router();
const prefix = '/customer-company';

// create a customer-type
routes.route('')
  .post(validate(CompannyRules.createCustomerCompanyType), customerCompanyController.createCustomerCompanyType);

// List options customer-company
routes.route('/get-options')
  .get(customerCompanyController.getOptions);

// Detail customer-company
routes.route('/:customer_company_id(\\d+)')
  .get(customerCompanyController.detailCustomerCompany);

// Update customer-company
routes.route('/:customer_company_id(\\d+)')
  .put(validate(rules.updateCustomerCompany), customerCompanyController.updateCustomerCompany);

module.exports = {
  prefix,
  routes,
};