const express = require('express');
const validate = require('express-validation');
const rules = require('./am-companytype.rule');
const amCompanyTypeController = require('./am-companytype.controller');
const routes = express.Router();
const prefix = '/company-type';

// List options am-companytype
routes.route('/get-options')
  .get(amCompanyTypeController.getOptions);

// List am-companytype
routes.route('')
  .get(amCompanyTypeController.getListCompanyType);

// Create new a am-companytype
routes.route('')
  .post(validate(rules.createCompanyType), amCompanyTypeController.createCompanyType);

// Change status a am-companytype
routes.route('/:companyTypeId(\\d+)/change-status')
  .put(validate(rules.changeStatusCompanyType), amCompanyTypeController.changeStatusCompanyType);

// Update a am-companytype
routes.route('/:companyTypeId(\\d+)')
  .put(validate(rules.updateCompanyType), amCompanyTypeController.updateCompanyType);

// Delete a am-companytype
routes.route('/:companyTypeId(\\d+)')
  .delete(amCompanyTypeController.deleteCompanyType);

// Detail a am-companytype
routes.route('/:companyTypeId(\\d+)')
  .get(amCompanyTypeController.detailCompanyType);

// Export excel
routes.route('/export-excel')
  .get(amCompanyTypeController.exportExcel);

module.exports = {
  prefix,
  routes,
};
