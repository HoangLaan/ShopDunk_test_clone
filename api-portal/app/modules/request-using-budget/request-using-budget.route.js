const express = require('express');
const validate = require('express-validation');
const rules = require('./request-using-budget.rule');
const controller = require('./request-using-budget.controller');

const routes = express.Router();

const prefix = '/request-using-budget';

// List
routes.route('').get(controller.getList);

//create code
routes.route('/create-code').get(controller.createRequestUsingBudgetCode);

//get remaining allocation budget
routes.route('/remaining-allocation-budget').get(controller.getRemainingAllocationBudget);

//get review
routes.route('/review').get(controller.getListReview);

//export excel
routes.route('/export-excel').post(controller.exportExcel);

// Export exportPDF
routes.route('/export-pdf/:request_using_budget_id').get(controller.exportPDF);

// get tree item
routes.route('/tree').get(controller.getTree);

// Download template
routes.route('/download-excel').get(controller.downloadTemplate);

// Import excel
routes.route('/import-excel').post(controller.importExcel);

//get requset purchase
routes.route('/requset-purchase').get(controller.getRequestPurchase);

//Update review
routes.route('/update-review').put(controller.updateReview);

// Create
routes.route('').post(validate(rules.create), controller.create);

// Update
routes.route('/:id').put(validate(rules.update), controller.update);

// Delete
routes.route('').delete(controller.remove);

// Detail
routes.route('/:id').get(controller.detail);

module.exports = {
    prefix,
    routes,
};
