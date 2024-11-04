const Joi = require('joi');

const ruleCreateOrUpdate = {
    email_template_id: Joi.number().integer(),
    email_template_name: Joi.string().required(),
    email_template_html: Joi.string().required(),
    mail_supplier: Joi.number().required(),
    email_template_params: Joi.array(),
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
