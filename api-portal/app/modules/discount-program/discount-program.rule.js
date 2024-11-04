const Joi = require('joi');

const validateRules = {
    approve: {
        body: {
            is_review: Joi.number().valid(0, 1, 2).required(),
        },
    },
};

module.exports = validateRules;
