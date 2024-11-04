const express = require('express');
const validate = require('express-validation');
const promotionController = require('./promotion_customer_type.controller');
const routes = express.Router();
const rules = require('./promotion_customer_type.rule');
const prefix = '/promotion_customer_type';
routes.route('')
  .get(promotionController.getList);
module.exports = {
  prefix,
  routes,
};
