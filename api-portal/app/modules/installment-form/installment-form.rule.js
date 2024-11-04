const Joi = require('joi');

const ruleCreateOrUpdate = {
    installment_form_id: Joi.number().integer(),
    installment_form_name: Joi.string().required(),

    description: Joi.string().allow([null, '']),

    is_active: Joi.number().valid(0, 1),
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
