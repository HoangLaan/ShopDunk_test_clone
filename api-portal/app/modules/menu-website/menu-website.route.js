const express = require('express');
const validate = require('express-validation');
const controller = require('./menu-website.controller');
const routes = express.Router();
const rules = require('./menu-website.rule');
const prefix = '/menu-website';

// Get list
routes.route('').get(controller.getListAsync);

// Get details
routes.route('/:id(\\d+)').get(controller.getDetailAsync);

// Delete
routes.route('/delete').delete(controller.deleteAsync);

// Export excel
routes.route('/export-excel').post(controller.exportExcelAsync);

// Generate next code
routes.route('/generate-next-code').get(controller.generateNextCodeAsync);

// Create
routes.route('').post(validate(rules.create), controller.createAsync);

// Update
routes.route('/:id(\\d+)').put(validate(rules.update), controller.updateAsync);

// eslint-disable-next-line no-undef
module.exports = {
    prefix,
    routes,
};
