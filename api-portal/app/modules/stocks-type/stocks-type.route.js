const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-type.rule');
const stocksTypeController = require('./stocks-type.controller');
const routes = express.Router();
const prefix = '/stocks-type';

// List options stocksType
routes.route('/get-options').get(stocksTypeController.getOptions);

// List stocksType
routes.route('').get(stocksTypeController.getListStocksType);

// Create new a stocksType
routes.route('').post(validate(rules.createStocksType), stocksTypeController.createStocksType);

// // Change status a stocksType
// routes.route('/:stocksTypeId(\\d+)/change-status')
//   .put(validate(rules.changeStatusStocksType), stocksTypeController.changeStatusStocksType);

// Update a stocksType
routes.route('/:stocksTypeId(\\d+)').put(validate(rules.updateStocksType), stocksTypeController.updateStocksType);

// Delete a stocksType
routes.route('/:stocksTypeId(\\d+)').delete(stocksTypeController.deleteStocksType);

// Detail a stocksType
routes.route('/:stocksTypeId(\\d+)').get(stocksTypeController.detailStocksType);

// Delete list stocksType
routes.route('').delete(stocksTypeController.deleteListStocksType);

module.exports = {
    prefix,
    routes,
};
