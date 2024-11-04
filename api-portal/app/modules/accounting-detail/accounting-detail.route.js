const express = require('express');
const validate = require('express-validation');
const controller = require('./accounting-detail.controller');
const routes = express.Router();
const rules = require('./accounting-detail.rule');
const prefix = '/accounting-detail';

// Get list
routes.route('').get(controller.getList);

// Get detail
routes.route('/:accounting_detail_id(\\d+)').get(controller.detail);

// Export excel
routes.route('/export-excel').get(controller.exportExcel);

// Export PdexportPDF
routes.route('/export-pdf').get(controller.exportPDF);

module.exports = {
    prefix,
    routes,
};
