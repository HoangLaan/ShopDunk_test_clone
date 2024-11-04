const Joi = require('joi');

const ruleCreateOrUpdate = {
    error_name: Joi.string().required(),
    error_code: Joi.string().required(),
    error_group_id: Joi.number().required(),
    is_active: Joi.number().valid(0, 1).required(),
    solutions: Joi.array().items(Joi.number()),
};

const validateRules = {
    createRsError: {
        body: ruleCreateOrUpdate,
    },
    updateRsError: {
        body: ruleCreateOrUpdate,
    }
};

module.exports = validateRules;
