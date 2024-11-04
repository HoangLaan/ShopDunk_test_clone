const express = require('express');
const validate = require('express-validation');
const promotionController = require('./promotion_apply_product.controller');
const routes = express.Router();
const rules = require('./promotion_apply_product.rule');
const prefix = '/promotion_apply_product';
// List area
routes.route('')
  .get(promotionController.getList);
module.exports = {
  prefix,
  routes,
};
