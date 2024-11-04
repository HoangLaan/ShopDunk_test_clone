const Joi = require('joi');

const ruleCreateOrUpdate = {
  borrow_type_name: Joi.string().required(),
  borrow_type: Joi.number().required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),

};

const validateRules = {
  createBorrowType: {
    body: ruleCreateOrUpdate,
  },
  updateBorrowType: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
