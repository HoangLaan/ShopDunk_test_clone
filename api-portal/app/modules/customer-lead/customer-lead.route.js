const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-lead.rule');
const customerLeadController = require('./customer-lead.controller');
const routes = express.Router();
const prefix = '/customer-lead';

routes.route('/generate-code').get(customerLeadController.generateCode);

routes.route('')
  .get(customerLeadController.getList)
  .post(validate(rules.createCustomerLead), customerLeadController.createOrUpdate);

routes.route('/delete').post(customerLeadController.delete);

routes.route('/get-options')
  .get(customerLeadController.getOptions)

routes.route('/export-excel').post(customerLeadController.exportExcel);
routes.route('/template-import').post(customerLeadController.getTemplateImport);
routes.route('/import-excel').post(customerLeadController.importExcel);

// Customer company
routes.route('/customer-company')
  .get(customerLeadController.getListCustomerCompany)
  .post(validate(rules.createCustomerCompany), customerLeadController.createCustomerCompany)

// Get by id
routes.route('/:customerLeadId')
  .get(customerLeadController.getById)

// Update by id
routes.route('/:customerLeadId')
  .put(validate(rules.updateCustomerLead), customerLeadController.createOrUpdate);

// Change pass crm-account
routes.route('/:customerLeadId/change-password').put(customerLeadController.changePassword);

// change Name crm-account
routes.route('/:customerLeadId/change-name').put(customerLeadController.changeName);

// Get options
routes.route('/source/get-options')
    .get(customerLeadController.getOptionsSource);

routes.route('/presenter/get-options')
    .get(customerLeadController.getOptionsPresenter);

routes.route('/customer-type/get-options')
    .get(customerLeadController.getOptionsCustomerType);

module.exports = {
  prefix,
  routes,
};
