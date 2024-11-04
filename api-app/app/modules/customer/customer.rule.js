const Joi = require('joi');

const ruleCreateOrUpdate = {
    full_name: Joi.string().required(),
    phone_number: Joi.string().required(),
};

const validateRules = {
    createOrUpdate: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
