const Joi = require('joi');

const ruleCreateOrUpdate = {
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  regime_type: Joi.string().required(),
  regime_name: Joi.string().required()
};

const validateRules = {
  createRegime: ruleCreateOrUpdate,
  updateRegime: ruleCreateOrUpdate,
};

module.exports = validateRules;

