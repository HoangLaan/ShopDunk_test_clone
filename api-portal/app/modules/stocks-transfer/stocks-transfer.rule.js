const Joi = require('joi');

const ruleCreateOrUpdate = {
  // stocks_transfer_type_name: Joi.string().required(),
  // is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStocksTransfer: {
    body: ruleCreateOrUpdate,
  },
  updateStocksTransfer: {
    body: ruleCreateOrUpdate,
  },
  changeStocksTransfer: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;