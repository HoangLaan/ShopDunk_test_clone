const Joi = require('joi');

const ruleCreateOrUpdate = {
  origin_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createOrigin: {
    body: ruleCreateOrUpdate,
  },
  updateOrigin: {
    body: ruleCreateOrUpdate,
  },
  changeStatusOrigin: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

