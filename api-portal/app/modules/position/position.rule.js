const Joi = require('joi');

const ruleCreateOrUpdate = {
  position_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createPosition: {
    body: ruleCreateOrUpdate,
  },
  updatePosition: {
    body: ruleCreateOrUpdate,
  },
  changeStatusPosition: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

