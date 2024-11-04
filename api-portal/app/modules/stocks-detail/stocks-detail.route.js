const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-detail.rule');
const stocksDetailController = require('./stocks-detail.controller');
const routes = express.Router();
const prefix = '/stocks-detail';

// List options stocksDetail
routes.route('/get-options').get(stocksDetailController.getOptions);

// List stocksDetail
routes.route('').get(stocksDetailController.getListStocksDetail);

// List options /get-stocks-options
routes.route('/get-stocks-options').get(stocksDetailController.geStocksOptions);

// Detail a stocksDetail
routes.route('/:stocksId(\\d+)').get(stocksDetailController.detailStocksDetail);

// get list product imei code
//routes.route('/product-imei-code/:product_id(\\d+)').get(stocksDetailController.getListProductImeiCode);

// Delete a stocksDetail
routes.route('/delete/:stocksProductHoldingId(\\d+)').delete(stocksDetailController.deleteStocksDetail);

// Get unitList
routes.route('/get-unit/:product_id(\\d+)').get(stocksDetailController.getUnitList);

// List
//routes.route('/list-product-imei-code').get(stocksDetailController.getListProductImeiStocksOut);

// getListProductImeiCodeStocks
routes.route('/product-imei-code-in-stocks').get(stocksDetailController.getListProductImeiCodeStocks);

routes.route('/exchangeqty').get(stocksDetailController.getListExchangeQty);
// List options getOptsuser import
routes.route('/get-user-import').get(stocksDetailController.getOptionsUserImport);

// getListRequestByProductImeiCode
routes.route('/get-request-by-imei').get(stocksDetailController.getListRequestByProductImeiCode);

// List options /products by cate and model
routes.route('/get-options-product').get(stocksDetailController.getOptionsProduct);

// List options /products by store and stocks
routes.route('/get-list-product-to-divide').get(stocksDetailController.getListProductImeiToDivide);
// List stocksDetail For Report exportExcelInventory
routes.route('/report').get(stocksDetailController.getListStocksDetailForReport);

// Export excel
routes.route('/report/export-xcel').post(stocksDetailController.exportExcelInventory);

// Get material, product imei codes
routes.route('/get-list-imei').get(stocksDetailController.getListIMEI);

// Calculate out stocks
routes.route('/calculate-out-stocks').post(stocksDetailController.calculateOutStocks);

// get last calculate out stocks date
routes.route('/last-calculate-date').get(stocksDetailController.getLastCalculateDate);

routes.route('/cogs-settings').post(stocksDetailController.createOrUpdateCogsSettings);

routes.route('/cogs-settings').get(stocksDetailController.getCogsSettings);

routes.route('/stocks-options').get(stocksDetailController.getStocksOptions);

routes.route('/export-excel').get(stocksDetailController.exportExcel);

module.exports = {
    prefix,
    routes,
};
