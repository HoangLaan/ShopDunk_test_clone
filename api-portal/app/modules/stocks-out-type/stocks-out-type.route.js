const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-out-type.rule');
const stocksOutTypeController = require('./stocks-out-type.controller');
const routes = express.Router();
const prefix = '/stocks-out-type';

// List options stocksOutType
routes.route('/get-options')
  .get(stocksOutTypeController.getOptions);

// List stocksOutType
routes.route('')
  .get(stocksOutTypeController.getListStocksOutType);

// Create new a stocksOutType
routes.route('')
  .post(validate(rules.createStocksOutType), stocksOutTypeController.createStocksOutType);

// Update a stocksOutType
routes.route('/:stocksOutTypeId(\\d+)')
  .put(validate(rules.updateStocksOutType), stocksOutTypeController.updateStocksInType);

// Delete a stocksOutType
routes.route('/delete')
  .post(stocksOutTypeController.deleteStocksOutType);

// Detail a stocksOutType
routes.route('/:stocksOutTypeId(\\d+)')
  .get(stocksOutTypeController.detailStocksOutType);

//Get options review level 
routes.route('/stocks-review-level/get-options')
  .get(stocksOutTypeController.getOptionsReviewLevel);

//Get options  user review 
routes.route('/get-user')
  .get(stocksOutTypeController.getListUserReview);

module.exports = {
  prefix,
  routes,
};
