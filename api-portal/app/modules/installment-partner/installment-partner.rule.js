const Joi = require('joi');

const ruleCreateOrUpdate = {
    installment_partner_id: Joi.number().integer(),
    installment_partner_name: Joi.string().required(),
    installment_partner_code: Joi.string().required(),

    is_active: Joi.number().valid(0, 1),
    is_system: Joi.number().valid(0, 1),
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
