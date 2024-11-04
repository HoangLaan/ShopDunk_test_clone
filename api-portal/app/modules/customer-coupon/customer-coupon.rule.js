const Joi = require('joi');
const omit = require('lodash/omit');

const customerCouponModel = {
  coupon_auto_code_id: Joi.number().required(),
  is_active: Joi.number().valid(0, 1),
  is_used: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(customerCouponModel, ['coupon_auto_code_id']),
  },
  update: {
    body: customerCouponModel,
  },
};

module.exports = rules;
