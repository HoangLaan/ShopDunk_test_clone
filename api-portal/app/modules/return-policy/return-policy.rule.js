const Joi = require('joi');

const ruleCreateOrUpdate = {
    // return_policy_name: Joi.string().required(),
    // return_policy_code: Joi.string().required(),
    // company_id: Joi.number().required(),
    // description: Joi.string().allow('', null),
    // is_active: Joi.number().valid(0, 1).required(),
    // is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
