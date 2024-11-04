const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-review-level.rule');
const stocksReviewLevelController = require('./stocks-review-level.controller');
const routes = express.Router();
const prefix = '/stocks-review-level';

// List options stocksReviewLevel
routes.route('/get-options').get(stocksReviewLevelController.getOptions);

// List stocksReviewLevel
routes.route('').get(stocksReviewLevelController.getListStocksReviewLevel);

// Create new a stocksReviewLevel
routes.route('').post(validate(rules.createStocksReviewLevel), stocksReviewLevelController.createStocksReviewLevel);

// // Change status a stocksReviewLevel
// routes.route('/:stocksReviewLevelId(\\d+)/change-status')
//   .put(validate(rules.changeStatusStocksReviewLevel), stocksReviewLevelController.changeStatusStocksReviewLevel);

// Update a stocksReviewLevel
routes
    .route('/:stocksReviewLevelId(\\d+)')
    .put(validate(rules.updateStocksReviewLevel), stocksReviewLevelController.updateStocksReviewLevel);

// Delete a stocksReviewLevel
routes.route('/:stocksReviewLevelId(\\d+)').delete(stocksReviewLevelController.deleteStocksReviewLevel);

// Detail a stocksReviewLevel
routes.route('/:stocksReviewLevelId(\\d+)').get(stocksReviewLevelController.detailStocksReviewLevel);

routes.route('/get-options/:type(\\d+)').get(stocksReviewLevelController.getOptionsByType);

module.exports = {
    prefix,
    routes,
};
