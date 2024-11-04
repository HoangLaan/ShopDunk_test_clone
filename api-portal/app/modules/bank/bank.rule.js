const Joi = require('joi');

const ruleCreateOrUpdate = {
    bank_id: Joi.number().allow('', null),
    bank_code: Joi.string().required(),
    bank_name: Joi.string().required(),
    bank_eglish_name: Joi.string(),
    bank_address: Joi.string(),
    description: Joi.string().allow('', null),
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
