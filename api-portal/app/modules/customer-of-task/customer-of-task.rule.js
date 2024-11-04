const Joi = require('joi');

const ruleCreateOrUpdate = {
    member_id: Joi.number().allow(null),
    data_leads_id: Joi.number().allow(null),
    source_id: Joi.number().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
