const Joi = require('joi');

const ruleCreateOrUpdate = {
    returnCondition_name: Joi.string().trim().max(250),
    description: Joi.string().allow(null, '').max(20000),
    created_user: Joi.string().allow(null, '').max(20000),
    updated_user: Joi.string().allow(null, '').max(20000),
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
