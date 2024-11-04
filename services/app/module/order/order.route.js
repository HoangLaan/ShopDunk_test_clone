const express = require('express');
const routes = express.Router();
const orderController = require('./order.controller');
const prefix = '/order';

routes.route('/review-user').post(orderController.pushNotification);

module.exports = {
  prefix,
  routes,
};
