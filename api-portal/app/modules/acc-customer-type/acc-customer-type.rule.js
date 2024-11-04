const Joi = require('joi');

const ruleCreateOrUpdate = {
  customer_type_id: Joi.array().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  created_user: Joi.string().required(),
  // created_date: Joi.string().required(),
  // update_user: Joi.string().allow('', null),
  // update_date: Joi.string().allow('', null),
  // is_deleted: Joi.number().valid(0, 1).required(),
  // deleted_user: Joi.string().allow('', null),
  // deleted_date: Joi.string().allow('', null),
};

const validateRules = {
  createAccCustomerType: {
    body: ruleCreateOrUpdate,
  },
  updateAccCustomerType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusAccCustomerType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;