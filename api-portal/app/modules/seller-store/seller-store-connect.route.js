const express = require('express');
const validate = require('express-validation');
const sellerStoreConnectController = require('./seller-store-connect.controller');
const routes = express.Router();
// const rules = require('./skill.rule');
const prefix = '/seller-store-connect';

// List skill
routes.route('').get(sellerStoreConnectController.getProfileShop);

routes.route('/option-stock').get(sellerStoreConnectController.getOptsStocks)

routes.route('/update-stock_id').post(sellerStoreConnectController.updateStocks);

module.exports = {
  prefix,
  routes,
};