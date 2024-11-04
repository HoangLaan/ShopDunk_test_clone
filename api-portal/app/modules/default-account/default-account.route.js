const express = require('express');
const validate = require('express-validation');
const rules = require('./default-account.rule');
const defaultAccountController = require('./default-account.controller');

const routes = express.Router();

const prefix = '/default-account';

// List Task Work Flow
routes.route('').get(defaultAccountController.getListDefaultAccount);

//Export excel
routes.route('/export-excel').get(defaultAccountController.exportExcel);

// Create new a Task Work Flow
routes.route('').post(validate(rules.create), defaultAccountController.createDefaultAccount);

// Update a Task Work Flow
routes.route('/:id(\\d+)').put(validate(rules.update), defaultAccountController.updateDefaultAccount);

// Delete a Task Work Flow
routes.route('').delete(defaultAccountController.deleteDefaultAccount);

// Detail a Task Work Flow
routes.route('/:id(\\d+)').get(defaultAccountController.detailDefaultAccount);

routes.route('/document-options').get(defaultAccountController.getDocumentOptions);
routes.route('/accounting-account-options').get(defaultAccountController.getAccountingAccountOptions);

module.exports = {
    prefix,
    routes,
};
