const express = require('express');
const controller = require('./compare-budget.controller');
const routes = express.Router();
const prefix = '/compare-budget/';

// Get list
routes.route('').get(controller.getList);

// Get list budget plan
routes.route('/budget-plan-opts').get(controller.getBudgetPlanOptions);

// Export excel
routes.route('/export-excel').get(controller.exportExcel);

module.exports = {
    prefix,
    routes,
};
