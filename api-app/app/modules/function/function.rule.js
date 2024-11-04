const Joi = require('joi');

const ruleCreateOrUpdate = {
  function_name: Joi.string().required(),
  function_alias: Joi.string().required(),
  function_group_id: Joi.number().required(),
  description: Joi.string().default(''),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
};

const ruleDelete = {
  list_id: Joi.array()
}

const validateRules = {
  createFunction: {
    body: ruleCreateOrUpdate,
  },
  updateFunction: {
    body: ruleCreateOrUpdate,
  },
  deleteFunctionList: {
    body: ruleDelete,
  },
  changeStatusFunction: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
