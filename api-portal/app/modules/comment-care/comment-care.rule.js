const Joi = require('joi');

const createBooking = {
    // customer_id: Joi.number().required(),
};

const validateRules = {
    createBooking: {
        body: createBooking,
    },
    update: {
        body: createBooking,
    },
    changeStatus: {
        body: {
            is_approved: Joi.number().valid(0, 1).required(),
        },
    },
    close: {
        body: {
            _closing: Joi.number().valid(1, 2, 3).required(),
        },
    },
    cashPayment: {
        body: {
            _id: Joi.number().required(),
            // customer_id: Joi.number().required(),
            payment_form_id: Joi.number().required(),
            description: Joi.string().required(),
            payment_value: Joi.number().required(),
        },
    },
    checkStatusToNotify: {
        body: {
            _id: Joi.number().required(),
            _status_id: Joi.number().required(),
            _type_id: Joi.number().required(),
        },
    },
};

module.exports = validateRules;
