const express = require('express');
const validate = require('express-validation');
const promotionOfferController = require('./promotion-offer.controller');
const routes = express.Router();
const rules = require('./promotion-offer.rule');
const prefix = '/promotion-offer';


// List SM_PROMOTIONOFFER
routes.route('')
  .get(promotionOfferController.getList);

// Detail a SM_PROMOTIONOFFER
routes.route('/:promotionOfferId(\\d+)')
  .get(promotionOfferController.detail);

// Create new a SM_PROMOTIONOFFER
routes.route('')
  .post(validate(rules.create),promotionOfferController.createPromotionOffer);

// Update a SM_PROMOTIONOFFER
routes.route('/:promotionOfferId(\\d+)')
  .put(validate(rules.update),promotionOfferController.updatePromotionOffer);

// Change status a SM_PROMOTIONOFFER
routes.route('/:promotionOfferId/change-status')
  .put(validate(rules.changeStatus), promotionOfferController.changeStatusPromotionOffer);

// Delete a SM_PROMOTIONOFFER
routes.route('')
  .delete(promotionOfferController.deletePromotionOffer);


module.exports = {
  prefix,
  routes,
};
