const Joi = require('joi');

const ruleCreateOrUpdate = {
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    work_schedule_type_id: Joi.string().required(),
    work_schedule_name: Joi.string().required(),
    order_id: Joi.number().integer().min(0),
    work_schedule_review: Joi.array(),
    work_schedule_reason_list: Joi.array(),
    is_active: Joi.number().valid([0, 1]),
    is_system: Joi.number().valid([0, 1]),
};

const validateRules = {
    create: ruleCreateOrUpdate,
    update: ruleCreateOrUpdate,
};

module.exports = validateRules;
