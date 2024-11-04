const Joi = require('joi');

const createOrder = {
    customer_id: Joi.number().required(),
    total_money: Joi.number().required(),
    stock_id: Joi.number().required(),
    products: Joi.object().required(),
    order_status_id: Joi.number().required(),
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
};

module.exports = validateRules;
