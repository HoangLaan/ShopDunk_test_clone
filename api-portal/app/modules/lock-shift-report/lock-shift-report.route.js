const express = require('express');
const controller = require('./lock-shift-report.controller');
const routes = express.Router();
const prefix = '/lock-shift-report';
// const validate = require('express-validation');
// const rules = require('./lock-shift-report.rule');

// Get list, create. update, delete
routes.route('').get(controller.getLockShiftReportList);

module.exports = {
    prefix,
    routes,
};
