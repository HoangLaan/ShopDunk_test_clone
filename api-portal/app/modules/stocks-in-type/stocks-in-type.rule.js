const Joi = require('joi');

const ruleCreateOrUpdate = {
  stocks_in_type_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStocksInType: {
    body: ruleCreateOrUpdate,
  },
  updateStocksInType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksInType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

