const Joi = require('joi');

const ruleCreateOrUpdate = {
};

const validateRules = {
  createStocksDetail: {
    body: ruleCreateOrUpdate,
  },
  updateStocksDetail: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksDetail: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

