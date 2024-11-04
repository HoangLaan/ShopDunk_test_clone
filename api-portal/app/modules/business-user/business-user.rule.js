const Joi = require('joi');

const ruleCreateOrUpdate = {
    business_id: Joi.number().required(),
    items: Joi.array().required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
