const Joi = require('joi');

const ruleCreateOrUpdate = {
    invoice_id: Joi.number().integer().allow([null]),
    invoice_no: Joi.string().allow([null, '']),
    is_active: Joi.number().valid(0, 1),
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
