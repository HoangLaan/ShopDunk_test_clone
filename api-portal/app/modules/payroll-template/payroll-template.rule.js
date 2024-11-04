const Joi = require('joi');

const ruleCreateOrUpdate = {
    template_name: Joi.string().required(),
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
