const Joi = require('joi');

const ruleCreateOrUpdate = {
  // stocks_review_level_name: Joi.string().required(),
  // is_active: Joi.number().valid(0, 1).required(),
  // description: Joi.string().allow(null,''),
  // is_stocks_in: Joi.number().valid(0, 1).allow(null),
  // is_stocks_out: Joi.number().valid(0, 1).allow(null),
  // is_stocks_take: Joi.number().valid(0, 1).allow(null),
  // is_system: Joi.number().valid(0, 1).allow(null),
};

const validateRules = {
  createStocksInRequest: {
    body: ruleCreateOrUpdate,
  },
  updateStocksInRequest: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksInRequest: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  createCoefficient:{
    body: {
    }
  }
};

module.exports = validateRules;

