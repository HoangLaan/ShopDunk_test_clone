const Joi = require('joi');

const ruleCreateOrUpdate = {
    position_level_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createPositionLevel: {
        body: ruleCreateOrUpdate,
    },
    updatePositionLevel: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
