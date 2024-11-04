const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-in-type.rule');
const stocksInTypeController = require('./stocks-in-type.controller');
const routes = express.Router();
const prefix = '/stocks-in-type';

// List options stocksInType
routes.route('/get-options')
  .get(stocksInTypeController.getOptions);

// List stocksInType
routes.route('')
  .get(stocksInTypeController.getListStocksInType);

// Create new a stocksInType
routes.route('')
  .post(validate(rules.createStocksInType), stocksInTypeController.createStocksInType);

// Update a stocksInType
routes.route('/:stocksInTypeId(\\d+)')
  .put(validate(rules.updateStocksInType), stocksInTypeController.updateStocksInType);

// Delete a stocksInType
routes.route('/delete')
  .delete(stocksInTypeController.deleteStocksInType);

// Detail a stocksInType
routes.route('/:stocksInTypeId(\\d+)')
  .get(stocksInTypeController.detailStocksInType);

//Get options review level in
routes.route('/stocks-review-level/get-options')
  .get(stocksInTypeController.getOptionsReviewLevel);

//Get options  user review 
routes.route('/get-user')
  .get(stocksInTypeController.getListUserReview);

module.exports = {
  prefix,
  routes,
};
