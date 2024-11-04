const express = require('express');
const validate = require('express-validation');
const promotionController = require('./promotion.controller');
const routes = express.Router();
const rules = require('./promotion.rule');
const prefix = '/promotion';


// List area
routes.route('')
  .get(promotionController.getList);

// Detail a area
routes.route('/:promotionId(\\d+)')
  .get(promotionController.detail);

// Create new a area
routes.route('')
  .post(validate(rules.create), promotionController.createPromotion);

// Update a area
routes.route('/:promotionId(\\d+)')
  .put(validate(rules.update), promotionController.updatePromotion);

// Change status a area
routes.route('/:promotionId/change-status')
  .put(validate(rules.changeStatus), promotionController.changeStatusPromotion);

// Change duyệt
routes.route('/:promotionId/approve')
  .put(validate(rules.approve), promotionController.approvePromotion);

// Delete a area
routes.route('')
  .delete(promotionController.deletePromotion);

// Stop promotion
routes.route('/:promotionId/stop')
  .put(promotionController.stopPromotion);

// List area
routes.route('/total-option')
  .get(promotionController.getTotalPromotion);

module.exports = {
  prefix,
  routes,
};
