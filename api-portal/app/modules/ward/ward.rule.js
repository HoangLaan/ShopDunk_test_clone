const Joi = require('joi');

const ruleCreateOrUpdate = {
    ward_name: Joi.string().required(),
    keywords: Joi.string().required(),
    district_id: Joi.number().required(),
    province_id: Joi.number().required(),
    priority: Joi.number().required(),
};

const validateRules = {
    createWard: ruleCreateOrUpdate,
    updateWard: ruleCreateOrUpdate,
};

module.exports = validateRules;
