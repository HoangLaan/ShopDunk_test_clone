const express = require('express');
const controller = require('./stocks.controller');
const prefix = '/stocks';
const routes = express.Router();

//Thanh toán đơn hàng
routes.route('/stocks-in-request').get(controller.getListStockInRequest);

routes.route('/stocks-in-request/:stock_in_request_id(\\d+)').get(controller.getDetailStockInRequest);

routes.route('/stocks-in-request/:stock_in_request_id(\\d+)/:product_id(\\d+)').get(controller.getListStockInProductImei);

routes.route('/stocks-in-request/:stock_in_request_id(\\d+)').post(controller.addStockInProductImei);
routes.route('/stocks-in-request/import-stock').post(controller.importStock);

module.exports = {
    prefix,
    routes,
};
