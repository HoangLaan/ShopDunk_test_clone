const express = require('express');
const validate = require('express-validation');
const preOrderController = require('./pre-order.controller');
const routes = express.Router();
const prefix = '/pre-order';

routes.route('/his-buy-ip').get(preOrderController.getCustomerHisBuyIphone);
routes.route('/his-buy-ip-15').get(preOrderController.getCustomerHisBuyIphone15);

routes.route('/interest').get(preOrderController.getInterestCustomer);

routes.route('/export-excel').post(preOrderController.exportExcel);

module.exports = {
    prefix,
    routes,
};
