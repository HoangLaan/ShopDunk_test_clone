const Joi = require('joi');

const ruleCreateOrUpdate = {
  level_name: Joi.string().allow(null,''),
  descriptions: Joi.string().allow(null,''),

};

const validateRules = {
  createLevel: {
    body: ruleCreateOrUpdate,
  },
  updateLevel: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
