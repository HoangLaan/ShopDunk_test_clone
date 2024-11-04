const Joi = require('joi');

const ruleCreateOrUpdate = {
    accounting_period_id: Joi.number().integer(),
    accounting_period_name: Joi.string().required(),
    company_id: Joi.number().integer().required(),
    apply_from_date: Joi.string(),
    apply_to_date: Joi.string(),
    description: Joi.string().allow([null, '']),

    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1),
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
