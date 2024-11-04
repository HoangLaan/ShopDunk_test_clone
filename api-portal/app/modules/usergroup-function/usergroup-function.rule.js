const Joi = require('joi');

const ruleFunctionGroup = Joi.object().keys({
  function_group_id: Joi.number().required(),
  has_permission: Joi.boolean().default(false),
  function_ids: Joi.array().items(Joi.number()),
});
const ruleUserGroup = Joi.object().keys({
  user_group_id: Joi.number().required(),
  function_group_ids: Joi.array().required().items(ruleFunctionGroup),
});
const ruleCreateOrUpdate = Joi.array().required().items(ruleUserGroup);

const validateRules = {
  createUserGroupFunction: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
};

module.exports = validateRules;
