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
  createStocksReviewLevel: {
    body: ruleCreateOrUpdate,
  },
  updateStocksReviewLevel: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksReviewLevel: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

