const Joi = require('joi');

const { MEASURE, CRITERIA, VALUE_TYPES } = require('./constants');

const ruleCreateOrUpdate = {
    budget_id: Joi.number().integer(),
    budget_type_id: Joi.number().integer().required(),
    short_name: Joi.string().max(250).required(),
    budget_name: Joi.string().max(250).required(),
    budget_code: Joi.string().min(1).max(250).required(),
    is_dynamic_budget: Joi.number().valid(0, 1),
    parent_id: Joi.number().integer().allow(null),
    description: Joi.string().allow(['', null]),
    note: Joi.string().allow(['', null]),

    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),

    budgetRules: Joi.array().items({
        budget_id: Joi.number(),
        rule_id: Joi.number(),
        budget_value: Joi.number(),
        measure: Joi.number().valid([MEASURE.PERCENT]),
        budget_value_type: Joi.number().valid([VALUE_TYPES.NULL, VALUE_TYPES.PERCENT, VALUE_TYPES.VND]),
        criteria: Joi.number().valid([CRITERIA.NO_ORDERS, CRITERIA.PROFIT, CRITERIA.REVENE]),
        date_from: Joi.string(),
        date_to: Joi.string(),
    }),
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
