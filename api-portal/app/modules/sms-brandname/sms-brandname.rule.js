const Joi = require('joi');

const validateRules = {
    status: {
        body: Joi.object().keys({
            from: Joi.string().required(),
            to: Joi.string().required(),
        }),
    },

    sendCustomerCareMessage: {
        body: Joi.object().keys({
            phone: Joi.string().required(),
            content: Joi.string().required(),
            brandname: Joi.string().allow('', null),
            is_unicode: Joi.number().allow('', null),
            sandbox: Joi.number().allow('', null),
            campaign_id: Joi.number().allow('', null),
            request_id: Joi.string().allow('', null),
            callback_url: Joi.string().allow('', null),
        }),
    },
};

module.exports = validateRules;
