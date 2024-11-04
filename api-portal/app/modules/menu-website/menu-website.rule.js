const Joi = require('joi');

const ruleCreateOrUpdate = {
    website_category_code: Joi.string().required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

// eslint-disable-next-line no-undef
module.exports = validateRules;
