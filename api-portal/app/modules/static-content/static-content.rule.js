const Joi = require('joi');

const ruleCreateOrUpdate = {
  static_name: Joi.string().required(),
  // content: Joi.string().allow('', null),
};

const validateRules = {
  createNews: {
    body: ruleCreateOrUpdate,
  },
  updateNews: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNews: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
