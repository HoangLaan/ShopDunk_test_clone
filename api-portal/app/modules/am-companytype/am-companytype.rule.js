const Joi = require('joi');

const ruleCreateOrUpdate = {
  company_type_name: Joi.string().required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  //is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCompanyType: {
    body: ruleCreateOrUpdate,
  },
  updateCompanyType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCompanyType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
