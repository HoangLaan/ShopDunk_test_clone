const express = require('express');
const validate = require('express-validation');
const rules = require('./accounting-account.rule');
const accountingAccountController = require('./accounting-account.controller');
const multer = require('multer');
const routes = express.Router();

const prefix = '/accounting-account';

// List accountingAccount
routes.route('').get(accountingAccountController.getListAccountingAccount);

// List accountingAccount
routes.route('/options').get(accountingAccountController.getOptions);

// get tree
routes.route('/tree').get(accountingAccountController.getTree);
//
routes.route('/export-excel').get(accountingAccountController.exportExcelAccountingAccount);
// Download template
routes.route('/download-excel').get(accountingAccountController.downloadTemplate);

// Import excel
routes.route('/import-excel').post(multer().single('account_import'), accountingAccountController.importExcel);

// Create new a accountingAccount
routes.route('').post(validate(rules.create), accountingAccountController.createAccountingAccount);

// Update a accountingAccount
routes.route('/:id').put(validate(rules.update), accountingAccountController.updateAccountingAccount);

// Delete a accountingAccount
routes.route('').delete(accountingAccountController.deleteAccountingAccount);

// Detail a accountingAccount
routes.route('/:id').get(accountingAccountController.detailAccountingAccount);

module.exports = {
    prefix,
    routes,
};
