const Joi = require('joi');

const ruleCreateOrUpdate = {
    // area_name: Joi.string().required(),
    // is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createTimeKeepingClaim: {
        body: ruleCreateOrUpdate,
    },
    updateTimeKeepingClaim: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
