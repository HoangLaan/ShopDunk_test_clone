const Joi = require('joi');

const createOrder = {
    // customer_id: Joi.number().required(),
    total_money: Joi.number().required(),
    products: Joi.object().required(),
    order_type_id: Joi.number().required(),
    store_id: Joi.number().required(),
};

const validateRules = {
    createOrder: {
        body: createOrder,
    },
    updateOrder: {
        body: createOrder,
    },
    changeStatusOrder: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
    closeOrder: {
        body: {
            order_closing: Joi.number().valid(1, 2, 3).required(),
        },
    },
    cashPayment: {
        body: {
            order_id: Joi.number().required(),
            // customer_id: Joi.number().required(),
            payment_form_id: Joi.number().required(),
            description: Joi.string().required(),
            payment_value: Joi.number().required(),
        },
    },
    checkOrderStatusToNotify: {
        body: {
            order_id: Joi.number().required(),
            order_status_id: Joi.number().required(),
            order_type_id: Joi.number().required(),
        },
    },
};

module.exports = validateRules;
