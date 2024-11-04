const Joi = require('joi');

const ruleCreateOrUpdate = {
    cash_flow_name: Joi.string().required(),
    cash_flow_code: Joi.string().required(),
    cash_flow_type: Joi.number().required(),
    company_id: Joi.number().required(),
    parent_id: Joi.number().allow(null),
    description: Joi.string().allow('', null),
    note: Joi.string().allow('', null),
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
