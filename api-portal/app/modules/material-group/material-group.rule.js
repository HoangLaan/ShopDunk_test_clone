const Joi = require('joi');

const ruleCreateOrUpdate = {
  material_group_name: Joi.string().required(),
  material_group_code: Joi.string().required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
  material_group_attribute: Joi.array().items({
    value: Joi.number().required(),
  }),
};

const validateRules = {
  createMaterialGroup: {
    body: ruleCreateOrUpdate,
  },
  updateMaterialGroup: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
