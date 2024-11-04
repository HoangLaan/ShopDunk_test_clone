const express = require('express');
const validate = require('express-validation');
const commissionController = require('./commission.controller');
const routes = express.Router();
const rules = require('./commission.rule');
const prefix = '/commission';

// List by user
routes.route('')
  .get(commissionController.getCommission);

// Detail by user
routes.route('/user/:order_commission_id(\\d+)')
  .get(commissionController.getDetailCommission);


module.exports = {
    prefix,
    routes,
};
