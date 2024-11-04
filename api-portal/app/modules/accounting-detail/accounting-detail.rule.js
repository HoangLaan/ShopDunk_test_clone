const Joi = require('joi');

const ruleCreateOrUpdate = {
    accounting_id: Joi.number().integer(),
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
