const Joi = require('joi');

const ruleCreateOrUpdate = {
  province_name: Joi.string().required(),
  keywords: Joi.string().required(),
  alt_name: Joi.string().required(),
  country_id: Joi.number().required(),
  priority: Joi.number().required(),
};

const validateRules = {
  createProvince: ruleCreateOrUpdate,
  updateProvince: ruleCreateOrUpdate,
};

module.exports = validateRules;

