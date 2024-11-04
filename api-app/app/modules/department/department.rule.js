const Joi = require('joi');
const rulePriorities = Joi.object().keys({
  department_id: Joi.number().required(),
  priority: Joi.number().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
  department_name: Joi.string().required(),
  priorities: Joi.array().allow(null).items(rulePriorities),
  company_id: Joi.number().allow(null),
  is_active: Joi.number().valid(0, 1).required(),
});

const rulechangeStatus = {
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createDepartment: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateDepartment: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  changeStatusDepartment:rulechangeStatus,
};

module.exports = validateRules;

