const express = require('express');
const validate = require('express-validation');
const rules = require('./price-review-level.rule');
const priceReviewLevelController = require('./price-review-level.controller');
const routes = express.Router();
const prefix = '/price-review-level';

// List PriceReviewLevel
routes.route('').get(priceReviewLevelController.getListPriceReviewLevel);

// Create new a PriceReviewLevel
routes.route('').post(validate(rules.createPriceReviewLevel), priceReviewLevelController.createPriceReviewLevel);

// Delete a PriceReviewLevel
routes.route('/delete').delete(priceReviewLevelController.deletePriceReviewLevel);

// Detail a PriceReviewLevel
routes.route('/:price_review_level_id(\\d+)').get(priceReviewLevelController.detailPriceReviewLevel);

// List options
routes.route('/get-options').get(priceReviewLevelController.getOptions);

module.exports = {
    prefix,
    routes,
};
