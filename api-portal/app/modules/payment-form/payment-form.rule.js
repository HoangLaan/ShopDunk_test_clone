const Joi = require('joi');

const ruleCreateOrUpdate = {
    payment_form_code: Joi.string().required(),
    payment_form_name: Joi.string().required(),
    payment_type: Joi.number().required(),
};

const validateRules = {
    createPaymentForm: {
        body: ruleCreateOrUpdate,
    },
    updatePaymentForm: {
        body: ruleCreateOrUpdate,
    },
    changeStatusPaymentForm: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
