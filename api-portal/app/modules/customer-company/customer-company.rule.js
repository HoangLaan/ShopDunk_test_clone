const Joi = require('joi');

const ruleCreateOrUpdate = {
  customer_company_id: Joi.string(),
  is_active: Joi.number().valid(1, 0).required(),
};

const validateRules = {
  createCustomerCompany: {
    body: ruleCreateOrUpdate,
  },
  updateCustomerCompany: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCustomerCompany: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;