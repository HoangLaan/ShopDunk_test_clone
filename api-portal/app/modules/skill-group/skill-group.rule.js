const Joi = require('joi');

const ruleCreateOrUpdate = {
    skillgroup_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
    description: Joi.string().allow('', null),

};

const validateRules = {
    createSkillGroup: {
        body: ruleCreateOrUpdate,
    },
    updateSkillGroup: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
