const Joi = require('joi');

const rules = {
    sendSMS: {
        body: {
            phone_number: Joi.string().required(),
            brandname: Joi.string().required(),
            content_sms: Joi.string().required(),
        },
    },
    sendAdv: {
        body: {
            phones: Joi.array().items(Joi.string()).required(),
            content: Joi.string().required(),
            send_date: Joi.string().allow(null, ''),
        },
    },
    read: {
        body: {
            notify_user_id: Joi.number().required(),
        },
    },
};

module.exports = rules;
