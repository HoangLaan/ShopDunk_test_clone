const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-deposit.rule');
const customerDepositController = require('./customer-deposit.controller');
const routes = express.Router();
const prefix = '/customer-deposit';

routes.route('').get(customerDepositController.getList);

routes.route('/export-excel').post(customerDepositController.exportExcel);
routes.route('/call').post(customerDepositController.updateCall);

module.exports = {
    prefix,
    routes,
};
