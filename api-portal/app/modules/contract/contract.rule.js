const Joi = require('joi');

const ruleCreateOrUpdate = {
    contract_name: Joi.string().required(),
    contract_no: Joi.string().allow('', null),
    company_id: Joi.number().required(),
    working_form_id: Joi.number().required(),
    contract_type_id: Joi.number().required(),
    contract_term_id: Joi.number().allow('', null),
    content: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
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
