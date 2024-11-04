const Joi = require('joi');

const ruleCreateOrUpdate = {
    vat_name: Joi.string().required(),
    value: Joi.required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createVat: {
        body: ruleCreateOrUpdate,
    },
    updateVat: {
        body: ruleCreateOrUpdate,
    },
    changeStatusVat: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
