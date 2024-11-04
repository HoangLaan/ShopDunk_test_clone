const Joi = require('joi');

const ruleCreateOrUpdate = {
  stocks_take_type_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStocksTakeType: {
    body: ruleCreateOrUpdate,
  },
  updateStocksTakeType: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;

