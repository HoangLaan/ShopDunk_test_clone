const Joi = require('joi');

const ruleCreateOrUpdate = {
    skill_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createSkill: {
        body: ruleCreateOrUpdate,
    },
    updateSkill: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
