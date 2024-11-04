const Joi = require('joi');

const ruleCreateOrUpdate = {
    user_level_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createUserLevel: {
        body: ruleCreateOrUpdate,
    },
    updateUserLevel: {
        body: ruleCreateOrUpdate,
    },
    changeStatusUserLevel: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
