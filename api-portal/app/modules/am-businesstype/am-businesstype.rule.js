const Joi = require('joi');

const ruleCreateOrUpdate = {
  business_type_name: Joi.string().required(),
  descriptions: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createAMBusinessType: {
    body: ruleCreateOrUpdate,
  },
  updateAMBusinessType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusAMBusinessType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
