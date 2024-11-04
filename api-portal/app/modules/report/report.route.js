const express = require('express');
const reportController = require('./report.controller');

const routes = express.Router();
const prefix = '/report';

// List
routes.route('').get(reportController.getList);

//export excel
routes.route('/export').get(reportController.exportExcel);

routes.route('/accounting').get(reportController.getListAccounting);

routes.route('/export-accounting').get(reportController.exportExcelAccounting);

module.exports = {
    prefix,
    routes,
};
