const Joi = require('joi');

const ruleCreateOrUpdate = {
    company_name: Joi.string().required(),
    company_type: Joi.number().required(),
    company_phone_number: Joi.string().allow('', null),
    company_email: Joi.string().allow('', null),
    created_user: Joi.string().required(),
    is_active: Joi.number().valid(1, 0).required(),
};

const validateRules = {
  createCustomerCompanyType: {
    body: ruleCreateOrUpdate,
  },
  updateCustomerCompanyType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCustomerCompanyType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;