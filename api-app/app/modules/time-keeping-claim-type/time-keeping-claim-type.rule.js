const Joi = require('joi');

const ruleCreateOrUpdate = {
    // area_name: Joi.string().required(),
    // is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createTimeKeepingClaimType: {
        body: ruleCreateOrUpdate,
    },
    updateTimeKeepingClaimType: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
