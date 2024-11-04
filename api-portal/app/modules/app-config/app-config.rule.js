const Joi = require('joi');

const ruleCreateOrUpdate = {
};

const validateRules = {
  createRequestPurchase: {
    body: ruleCreateOrUpdate,
  },
  updateRequestPurchase: {
    body: ruleCreateOrUpdate,
  },
  changeStatusRequestPurchase: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  createOrUpdateDriver: {
    body: {},
  },
};

module.exports = validateRules;

