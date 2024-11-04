const Joi = require('joi');

const ruleCreateOrUpdate = {
  // stocks_type_name: Joi.string().required(),
  // is_active: Joi.number().valid(0, 1).required(),
  // description: Joi.string().allow(null,''),
  // is_supplier: Joi.number().valid(0, 1).allow(null),
  // is_company: Joi.number().valid(0, 1).allow(null),
  // is_agency: Joi.number().valid(0, 1).allow(null),
  // is_manufacturer: Joi.number().valid(0, 1).allow(null),
};

const validateRules = {
  createStocksType: {
    body: ruleCreateOrUpdate,
  },
  updateStocksType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStocksType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;

