const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks.rule');
const stocksController = require('./stocks.controller');
const routes = express.Router();
const prefix = '/stocks';

// List
routes.route('').get(stocksController.getListStocks);
routes.route('/stocks-type').get(stocksController.getListStocksType);
routes.route('/companies').get(stocksController.getListCompany);
routes.route('/manufacturers').get(stocksController.getListManufacturer);
routes.route('/stock-manager').get(stocksController.getListStockManager);
routes.route('/business-by-companyid').get(stocksController.getListBusinessByCompanyID);

// Create
routes.route('').post(validate(rules.createStocks), stocksController.createStocks);
routes
    .route('/stocks-manager')
    .post(validate(rules.createStocksStocksManager), stocksController.createStocksStocksManager);

// Update
routes.route('/:stocks_id(\\d+)').put(validate(rules.updateStocks), stocksController.updateStocks);

// Delete
routes.route('/delete').delete(stocksController.deleteStocks);

routes.route('/stocks-manager/:stocks_manager_id(\\d+)').delete(stocksController.deleteStocksStocksManager);

// List options
routes.route('/get-options').get(stocksController.getOptions);

// Detail
routes.route('/:stocks_id(\\d+)').get(stocksController.detailStocks);

//list option store
routes.route('/store/get-options').get(stocksController.getListStoreOptions);

//list option stocks type
routes.route('/stocks-type/get-options').get(stocksController.getListStocksTypeOptions);

//list option user by store
routes.route('/list-user/get-options').get(stocksController.getListUserByStoreIdOptions);

// List options by store
routes.route('/get-options-by-store').get(stocksController.getOptionsStocksByStore);

//list option store
routes.route('/store/get-options-by-param').get(stocksController.getListStoreOptionsByParams);

// List options by store or business
routes.route('/get-options-by-store-business').get(stocksController.getOptionsStocksByStoreBusiness);

// List options by store or business
routes.route('/check-belongs-to-business').get(stocksController.checkBelongsToBusiness);

module.exports = {
    prefix,
    routes,
};
