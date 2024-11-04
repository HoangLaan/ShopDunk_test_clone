const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-out-request.rule');
const stocksOutRequestController = require('./stocks-out-request.controller');
const routes = express.Router();
const prefix = '/stocks-out-request';

// List
routes.route('/export-pdf-by-order/:order_id').get(stocksOutRequestController.exportPDFByOrder);

module.exports = {
    prefix,
    routes,
};
