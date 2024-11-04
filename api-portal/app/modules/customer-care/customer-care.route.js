const express = require('express');
const validate = require('express-validation');
const customerCareController = require('./customer-care.controller');
const routes = express.Router();
const rules = require('./customer-care.rule');
const prefix = '/customer-care';

routes.route('')
  .get(customerCareController.getList)

routes.route('/export-excel').post(customerCareController.exportExcel);
routes.route('/get-options-order-type').get(customerCareController.getOptionsOrderType);

module.exports = {
    prefix,
    routes,
};
