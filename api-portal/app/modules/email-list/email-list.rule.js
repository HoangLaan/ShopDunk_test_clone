const Joi = require('joi');

const ruleCreateOrUpdate = {
    email_list_id: Joi.number().integer(),
    email_list_name: Joi.string().required(),
    email_list_type: Joi.number(),
    descriptions: Joi.string().allow(['', null]),
    customer_list: Joi.array(),
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
