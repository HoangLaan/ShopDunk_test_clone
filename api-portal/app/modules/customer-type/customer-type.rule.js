const Joi = require('joi');

const ruleCreateOrUpdate = {
  customer_type_name: Joi.string().required(),
  business_id: Joi.number().required(),
  company_id: Joi.number().required(),
  // customer_type_group_id: Joi.number().required(),
  // color: Joi.string().allow('', null),
  // note_color: Joi.string().allow('', null),
  // description: Joi.string().allow('', null),
  order_index: Joi.number().allow('', null),
  // is_member_type: Joi.number().valid(0, 1).allow('', null),
  // is_sell: Joi.number().valid(0, 1).allow('', null),
  // is_system: Joi.number().valid(0, 1).required(),
  // is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCustomerType: {
    body: ruleCreateOrUpdate,
  },
  updateCustomerType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCustomerType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
