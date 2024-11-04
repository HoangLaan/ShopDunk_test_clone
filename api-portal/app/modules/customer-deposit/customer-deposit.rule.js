const Joi = require('joi');
const omit = require('lodash/omit');

const customerDepositModel = {
  customer_deposit_id: Joi.number().required(),
  customer_deposit_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(customerDepositModel, ['customer_deposit_id']),
  },
  update: {
    body: customerDepositModel,
  },
};

module.exports = rules;
