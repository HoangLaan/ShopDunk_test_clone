const express = require('express');
const validate = require('express-validation');
const promotionController = require('./promotion_company.controller');
const routes = express.Router();
const rules = require('./promotion_company.rule');
const prefix = '/promotion_company';
// List area
routes.route('')
  .get(promotionController.getList);
module.exports = {
  prefix,
  routes,
};
