const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-coupon.rule');
const customerCouponController = require('./customer-coupon.controller');
const routes = express.Router();
const prefix = '/customer-coupon';

routes
  .route('')
  .get(customerCouponController.getList)
  .post(validate(rules.create), customerCouponController.createOrUpdate)
  .put(validate(rules.update), customerCouponController.createOrUpdate)
  .delete(customerCouponController.delete);

routes.route('/:id').get(customerCouponController.getById);

module.exports = {
  prefix,
  routes,
};
