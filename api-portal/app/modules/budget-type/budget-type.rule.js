const Joi = require('joi');

const ruleCreateOrUpdate = {
  budget_type_name: Joi.string().required(),
  budget_type_code: Joi.string().required(),
  company_id: Joi.number().required(),
  business_id: Joi.number().required(),
  effective_time: Joi.number().required(),
  description: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
  budget_type_review_list: Joi.array().items({
    budget_level_from: Joi.number().min(0).max(1000000000).required(),
    budget_level_to: Joi.number().min(1).max(1000000000).required(),
  }),
};

const validateRules = {
  createBudgetType: {
    body: ruleCreateOrUpdate,
  },
  updateBudgetType: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
