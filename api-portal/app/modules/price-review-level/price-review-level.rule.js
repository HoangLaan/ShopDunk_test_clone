const Joi = require('joi');

const ruleCreateOrUpdate = {
    price_review_level_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createPriceReviewLevel: {
        body: ruleCreateOrUpdate,
    },
    updatePriceReviewLevel: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
