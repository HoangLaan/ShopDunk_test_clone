const Joi = require('joi');

const ruleCreateOrUpdate = {
    order_type_name: Joi.string().required(),
    order_status_list: Joi.array().required(),
    view_function_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    add_function_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    edit_function_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    delete_function_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
};

const validateRules = {
    createOrderType: {
        body: ruleCreateOrUpdate,
    },
    updateOrderType: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
