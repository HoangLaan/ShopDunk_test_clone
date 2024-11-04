const express = require('express');
const validate = require('express-validation');
const controller = require('./budget.controller');
const routes = express.Router();
const rules = require('./budget.rule');
const prefix = '/budget/';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getListBudget)
    .post(validate(rules.create), controller.createBudget)
    .put(validate(rules.update), controller.updateBudget)
    .delete(controller.deleteListBudget);

// Get detail
routes.route('/:budget_id(\\d+)').get(controller.detailBudget);

// Get options
routes.route('/get-options').get(controller.getOptions);

// Export excel
routes.route('/export-excel').get(controller.exportExcel);

// Download template
routes.route('/download-excel').get(controller.downloadExcel);

// Import excel
routes.route('/import-excel').post(controller.importExcel);

module.exports = {
    prefix,
    routes,
};
