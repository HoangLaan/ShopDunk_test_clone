const Joi = require('joi');

const ruleCreateOrUpdate = {
    store_type_name: Joi.string().required(),
    company_id: Joi.number().required(),
    business_id: Joi.number().required(),
    description: Joi.string().allow('', null),
    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),

    stock_type_ids: Joi.array().items(Joi.number(), Joi.string()).allow([], null),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
