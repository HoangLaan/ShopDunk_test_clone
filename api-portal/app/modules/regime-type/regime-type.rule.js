const Joi = require('joi');

const ruleCreateOrUpdate = {
    regime_type_code: Joi.string().trim().required().max(20),
    regime_type_name: Joi.string().trim().required().max(250),
    policy: Joi.string().max(2000).required(),
    description: Joi.string().allow(null, '').max(1000),
};

const validateRules = {
    createRegimeType: {
        body: ruleCreateOrUpdate,
    },
    updateRegimeType: {
        body: ruleCreateOrUpdate,
    },
    createReviewLevel: {
        body: {
            company_id: Joi.number().required(),
            review_level_name: Joi.string().required(),
        },
    },
};

module.exports = validateRules;
