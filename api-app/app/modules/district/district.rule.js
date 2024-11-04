const Joi = require('joi');

const ruleCreateOrUpdate = {
  district_name: Joi.string().required(),
  keywords: Joi.string().required(),
  province_id: Joi.number().required(),
  priority: Joi.number().required(),
};

const validateRules = {
  createDistrict: ruleCreateOrUpdate,
  updateDistrict: ruleCreateOrUpdate,
};

module.exports = validateRules;

