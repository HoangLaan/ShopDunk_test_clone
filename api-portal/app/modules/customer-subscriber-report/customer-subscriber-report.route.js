const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-subscriber-report.rule');
const customerSubscriberReportController = require('./customer-subscriber-report.controller');
const routes = express.Router();
const prefix = '/customer-subscriber-report';

routes.route('').get(customerSubscriberReportController.getList);

routes.route('/export-excel').post(customerSubscriberReportController.exportExcel);

module.exports = {
    prefix,
    routes,
};
