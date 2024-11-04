const Joi = require('joi');

const ruleCreateOrUpdate = {
    hr_salary_name: Joi.string().required().max(250),
    hr_salary_from: Joi.number().required().greater(0).less(Joi.ref('hr_salary_to')),
    hr_salary_to: Joi.number().required().greater(Joi.ref('hr_salary_from')),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
