const Joi = require('joi');

const ruleCreateOrUpdate = {
  stocks_out_type_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStocksOutType: {
    body: ruleCreateOrUpdate,
  },
  updateStocksOutType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksOutType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

