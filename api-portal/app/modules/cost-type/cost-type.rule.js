const Joi = require('joi');

const ruleCreateOrUpdate = {
  cost_name: Joi.string().required(),
  description: Joi.string().allow(['', null]),
  is_discount: Joi.number().valid(0, 1).required(),
  is_percent: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCostType: {
    body: ruleCreateOrUpdate,
  },
  updateCostType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCostType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;