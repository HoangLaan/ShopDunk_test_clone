
const Joi = require('joi');

const ruleCreateOrUpdate = {
  salary_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createSalary: {
    body: ruleCreateOrUpdate,
  },
  UpdateSalary: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;

