const Joi = require('joi');

const ruleCreateOrUpdate = {
    username: Joi.string().required(),
    department_new_id: Joi.number().required(),
    position_level_new_id: Joi.number().required(),
    position_new_id: Joi.number().required(),
    apply_date: Joi.string().required(),
    reason: Joi.string().allow(null),
};

const validateRules = {
    createULHistory: {
        body: ruleCreateOrUpdate,
    },
    updateULHistory: {
        body: ruleCreateOrUpdate,
    },
    deleteULHistory: {
        body: {
            ids: Joi.array().required().min(1),
        },
    },
};

module.exports = validateRules;
