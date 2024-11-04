const Joi = require('joi');

const ruleCreateOrUpdate = {
    email_history_id: Joi.number().integer(),
    email_from: Joi.string().required(),
    email_to: Joi.string().required(),
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
