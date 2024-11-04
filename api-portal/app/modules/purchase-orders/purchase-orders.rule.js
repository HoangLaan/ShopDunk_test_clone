const Joi = require('joi');

const ruleCreateOrUpdate = {
    degree_name: Joi.string().allow(null, ''),
    descriptions: Joi.string().allow(null, ''),
};

const validateRules = {
    createDegree: {
        body: ruleCreateOrUpdate,
    },
    updateDegree: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
