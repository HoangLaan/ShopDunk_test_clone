const Joi = require('joi');

const rules = {
    sendTextMessage: {
        body: {
            user_id: Joi.string().required(),
            text_message: Joi.string().required(),
            attachment_url: Joi.string().allow(null, '')
        },
    },
    sendZNS: {
        body: {
            mode: Joi.string().allow(null, ''),
            phone: Joi.string().required(),
            template_id: Joi.string().required(),
            template_data: Joi.object().required(),
        },
    },
};

module.exports = rules;
