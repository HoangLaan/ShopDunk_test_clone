const express = require('express');
const validate = require('express-validation');
const promotionController = require('./promotion_offer_apply.controller');
const routes = express.Router();
const rules = require('./promotion_offer_apply.rule');
const prefix = '/promotion_offer_apply';
routes.route('')
  .get(promotionController.getList);
module.exports = {
  prefix,
  routes,
};
