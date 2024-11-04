const Joi = require('joi');

const ruleCreateOrUpdate = {
    brand_name: Joi.string().required(),
    brand_code: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
    description: Joi.string().allow('', null),

};

const validateRules = {
    createBrand: {
        body: ruleCreateOrUpdate,
    },
    updateBrand: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
