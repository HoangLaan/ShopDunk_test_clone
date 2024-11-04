const Joi = require('joi');
const { TYPE_VALUE } = require('./constants');

const ruleCreate = {
    commission_name: Joi.string().required(),
    type_value: Joi.number().valid(TYPE_VALUE.MONEY, TYPE_VALUE.PERCENT).required(),
    commission_value: Joi.number().when('type_value', {
        is: TYPE_VALUE.PERCENT,
        then: Joi.number().min(0).max(100).allow(null),
        otherwise: Joi.number().min(0).allow(null),
    }),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    company_id: Joi.number().required(),
    department_staff_type: Joi.number().allow(null),
    is_auto_renew: Joi.number().valid(0, 1).allow(null),
    renew_day_in_month: Joi.number().min(1).max(31).allow(null),
    description: Joi.string().allow(null),
    reviewed_user: Joi.string().allow(null),
    reviewed_note: Joi.string().allow(null),
    is_reviewed: Joi.number().valid(0, 1, 2).allow(null),
    order_types: Joi.array().items(
        Joi.object().keys({
            id: Joi.number().required(),
        }),
    ),
    business_apply: Joi.array()
        .items(
            Joi.object().keys({
                id: Joi.number().required(),
            }),
        )
        .required(),
    departments: Joi.array()
        .items(
            Joi.object().keys({
                department_id: Joi.number().required(),
                commission_value: Joi.number().required(),
                type_value: Joi.number().valid(TYPE_VALUE.MONEY, TYPE_VALUE.PERCENT).required(),
            }),
        )
        .required(),
    positions: Joi.array().items(
        Joi.object().keys({
            position_id: Joi.number().required(),
            commission_value: Joi.number().required().allow(null),
            type_value: Joi.number().valid(TYPE_VALUE.MONEY, TYPE_VALUE.PERCENT).required(),
        }),
    ),
    is_divide_to_position: Joi.number().valid(0, 1).required(),
    is_divide_by_department: Joi.number().valid(0, 1).required(),
    is_divide_by_shift: Joi.number().valid(0, 1).required(),
    is_divide_to_sale_employee: Joi.number().valid(0, 1).required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const rules = {
    createCommission: {
        body: ruleCreate,
    },
    updateCommission: {
        body: ruleCreate,
    },
    stopCommission: {
        body: {
            is_stopped: Joi.number().valid(0, 1).allow(null),
            stopped_reason: Joi.string().when('is_stopped', {
                is: 1,
                then: Joi.string().required(),
                otherwise: Joi.string().allow(null),
            }),
        },
    },
};

module.exports = rules;
