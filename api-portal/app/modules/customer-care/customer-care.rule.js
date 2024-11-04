const Joi = require('joi');

const ruleCreate = {
    request_purchase_code: Joi.string().required(),
    username: Joi.string().required(),
    created_user: Joi.string().required(),
    company_id: Joi.number().integer().required(),
    business_request_id: Joi.number().integer().required(),
    business_receive_id: Joi.number().integer().required(),
    department_request_id: Joi.number().integer().required(),
    store_receive_id: Joi.number().integer().required(),
    supplier_id: Joi.number().integer().required(),
    purchase_requisition_list: Joi.array().items(Joi.number().integer().required()).required(),
    description: Joi.string().allow(null),
    is_active: Joi.number().integer().min(0).max(1).required(),
    is_ordered: Joi.number().integer().min(0).max(1).required(),
};
const rules = {
    create: {
        body: ruleCreate,
    },
    update: {
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
