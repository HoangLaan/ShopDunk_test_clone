const Joi = require('joi');

const ruleCreateOrUpdate = {
    unit_name: Joi.string().required(),
    description: Joi.string().allow('', null),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createUnit: {
        body: ruleCreateOrUpdate,
    },
    updateUnit: {
        body: ruleCreateOrUpdate,
    },
    changeStatusUnit: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
