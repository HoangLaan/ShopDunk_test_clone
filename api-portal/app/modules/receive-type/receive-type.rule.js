const Joi = require('joi');

const ruleCreateOrUpdate = {
    receive_type_code: Joi.string().required(),
    receive_type_name: Joi.string().required(),
    company_id: Joi.number().required(),
    business_id_list: Joi.array().items(Joi.number()).required(),
};

const validateRules = {
    createReceiveType: {
        body: ruleCreateOrUpdate,
    },
    updateReceiveType: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
