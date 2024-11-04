const Joi = require('joi');

const ruleCreate = {
    description: Joi.string().allow(null),
    is_active: Joi.number().integer().min(0).max(1).required(),
};

const rules = {
    create: {
        body: ruleCreate,
    },
    update: {
        body: ruleCreate,
    },
};

module.exports = rules;
