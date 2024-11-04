const Joi = require('joi');

const ruleCreateOrUpdate = {
    user_group_name: Joi.string().required(),
    business_id: Joi.number().allow('', null),
    description: Joi.string().allow('', null),
    order_index: Joi.number().required(),
    is_active: Joi.number().valid(0, 1).required(),
    // is_system: Joi.number().valid(0, 1).required(),
    // user_group_functions: Joi.array().required(),
};

const validateRules = {
    createUserGroup: {
        body: ruleCreateOrUpdate,
    },
    updateUserGroup: {
        body: ruleCreateOrUpdate,
    },
    deleteUserGroup: {
        body: {
            ids: Joi.array().required().min(1)
        }
    }
};

module.exports = validateRules;
