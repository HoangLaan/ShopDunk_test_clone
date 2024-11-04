const Joi = require('joi');

const ruleCreate = {
    full_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    task_type_id: Joi.number().required(),
};
const rules = {
    create: {
        body: ruleCreate,
    },
};

module.exports = rules;
