const Joi = require('joi');

const ruleCreateOrUpdate = {
    item_id: Joi.number().integer(),
    item_name: Joi.string().required(),
    item_code: Joi.string().required().min(1).max(10),
    company_id: Joi.number().integer().required(),
    parent_id: Joi.number().integer(),
    budget_id: Joi.number().integer().allow([null]),
    is_budget_creation: Joi.number().valid(0, 1),
    is_budget_adjustment: Joi.number().valid(0, 1),
    description: Joi.string().allow(['', null]),
    note: Joi.string().allow(['', null]),

    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
