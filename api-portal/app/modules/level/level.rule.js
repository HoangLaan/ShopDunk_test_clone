const Joi = require('joi');

const ruleCreateOrUpdate = {
    level_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createLevel: {
        body: ruleCreateOrUpdate,
    },
    updateLevel: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
