const express = require('express');
const validate = require('express-validation');
const rules = require('./partner.rule');
const partnerController = require('./partner.controller');

const routes = express.Router();

const prefix = '/partner';

// List partner
routes.route('').get(partnerController.getListPartner);

// Create new a partner
routes.route('').post(validate(rules.create), partnerController.createPartner);

// List options business
routes.route('/get-options').get(partnerController.getOptions);

//List partner and crm_account
routes.route('/get-options-list-account').get(partnerController.getOptionsListAccount);

// List options source
routes.route('/get-option-source').get(partnerController.getOptionSource);

// List options user
routes.route('/get-option-user').get(partnerController.getOptionUser);

// List options account
routes.route('/get-option-account').get(partnerController.getOptionAccount);

// List options customer type
routes.route('/get-option-customer-type').get(partnerController.getOptionCustomerType);

//List customer contact
routes.route('/get-customer-contact').get(partnerController.getCustomerContact);

// Get information customer type
routes.route('/get-customer-type/:id').get(partnerController.getCustomerTypeInfo);
// Update a partner
routes.route('/:id').put(validate(rules.update), partnerController.updatePartner);

// Delete a partner
routes.route('').delete(partnerController.deletePartner);

// Detail a partner
routes.route('/:id').get(partnerController.detailPartner);

routes.route('/export-excel').post(partnerController.exportExcel);

module.exports = {
    prefix,
    routes,
};
