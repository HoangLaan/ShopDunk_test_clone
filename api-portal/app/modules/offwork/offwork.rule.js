const Joi = require('joi');

const ruleCreateOrUpdate = {
  fromdate: Joi.string().required(),
  todate: Joi.string().required(),
  content_off_work: Joi.string().required(),
  off_work_type_id: Joi.number().required()
};

const validateRules = {
  createOffWork:ruleCreateOrUpdate,
  updateOffWork: ruleCreateOrUpdate,
};

module.exports = validateRules;

