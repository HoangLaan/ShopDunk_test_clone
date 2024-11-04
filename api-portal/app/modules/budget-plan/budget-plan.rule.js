const Joi = require('joi');

const ruleCreateOrUpdate = {
  company_id: Joi.number().required(),
  budget_plan_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createBudgetPlan: {
    body: ruleCreateOrUpdate,
  },
  updateBudgetPlan: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
