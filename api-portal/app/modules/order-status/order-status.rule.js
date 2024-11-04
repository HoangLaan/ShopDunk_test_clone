const Joi = require('joi');

const ruleCreateOrUpdate = {
    order_status_name: Joi.string().required().max(250),
    // description: Joi.string().max(2000),
};

const validateRules = {
    createOrderStatus: {
        body: ruleCreateOrUpdate,
    },
    updateOrderStatus: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
