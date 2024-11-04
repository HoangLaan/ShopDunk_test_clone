const Joi = require('joi');

const ruleCreateOrUpdate = {
    country_name: Joi.string().required(),
    keywords: Joi.string().required(),
    zip_code: Joi.string().required(),
    state_id: Joi.number().required(),
    priority: Joi.number().required(),
};

const validateRules = {
    createCountry: ruleCreateOrUpdate,
    updateCountry: ruleCreateOrUpdate,
};

module.exports = validateRules;
