const express = require('express');
const validate = require('express-validation');
const controller = require('./item.controller');
const routes = express.Router();
const rules = require('./item.rule');
const prefix = '/item/';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getListItem)
    .post(validate(rules.create), controller.createItem)
    .put(validate(rules.update), controller.updateItem)
    .delete(controller.deleteListItem);

// Get detail
routes.route('/:item_id(\\d+)').get(controller.detailItem);

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
