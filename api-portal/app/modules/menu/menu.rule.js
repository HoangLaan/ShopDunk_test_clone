const Joi = require('joi');

const ruleCreateOrUpdate = {
  menu_name: Joi.string().required(),
  // module_id: Joi.number().required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createMenu: {
    body: ruleCreateOrUpdate,
  },
  updateMenu: {
    body: ruleCreateOrUpdate,
  },
  changeStatusMenu: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
