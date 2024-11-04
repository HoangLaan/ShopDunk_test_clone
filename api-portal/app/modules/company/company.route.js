const express = require('express');
const validate = require('express-validation');
const companyController = require('./company.controller');
const routes = express.Router();
const rules = require('./company.rule');
const prefix = '/company';


// List userGroup
routes.route('')
    .get(companyController.getListCompany);

// Detail a company
routes.route('/:companyId(\\d+)')
    .get(companyController.detailCompany);

// Create new a userGroup
routes.route('')
    .post(validate(rules.createCompany), companyController.createCompany);

// Update a userGroup
routes.route('/:companyId(\\d+)')
    .put(validate(rules.updateCompany), companyController.updateCompany);

// Change status a company
routes.route('/:companyId/change-status')
    .put(validate(rules.changeStatusCompany), companyController.changeStatusCompany);

// Delete a company
routes.route('/:companyId(\\d+)')
    .delete(companyController.deleteCompany);

// List options am-company
routes.route('/get-options')
    .get(companyController.getOptions);

// List options am-company
routes.route('/export-excel')
    .get(companyController.exportExcel);

// List options am-company of user has been assigned in bussiness
routes.route('/get-options/user')
    .get(companyController.getOptionsForUser);

routes.route('/:company_id(\\d+)/bank-account/get-options')
    .get(companyController.getBankAccountOptions);

module.exports = {
    prefix,
    routes,
};
