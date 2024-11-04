const Joi = require('joi');

const ruleCreateOrUpdate = {
  experience_name: Joi.string().trim().required().max(250),
  experience_type: Joi.number().allow(null, ''),
  experience_from: Joi.number().required(),
  experience_to: Joi.number().allow(null, ''),
  order_index: Joi.number().allow(null, '').max(999999),
  description: Joi.string().allow(null, '').max(20000),

};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  update: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
