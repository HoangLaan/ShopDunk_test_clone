const Joi = require('joi');

const rules = {
    sendSMS: {
      body: {
        phone_number: Joi.string().required(),
        brandname: Joi.string().required(),
        content_sms: Joi.string().required(),
      }
    },
    sendSMSVoucher: {
      body: {
        phone: Joi.string().required(),
        email: Joi.string().allow('', null),
        customer_name: Joi.string().required(),
        voucher_name: Joi.required(),
        voucher_code: Joi.string().required(),
      }
    },
    sendZNSMiniGame: {
      body: {
        phone: Joi.string().required(),
        customer_name: Joi.string().required(),
        mini_game: Joi.string().required(),
        voucher_price: Joi.string().required(),
      }
    },
    sendSMSToSubscriber: {
      body: {
        phone: Joi.string().required(),
        email: Joi.string().allow('', null),
        customer_name: Joi.string().required(),
      }
    },
};

module.exports = rules;
