const Joi = require('joi');

const ruleCreateOrUpdate = {
  work_type_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createWorkType: {
    body: ruleCreateOrUpdate,
  },
  updateWorkType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusWorkType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

