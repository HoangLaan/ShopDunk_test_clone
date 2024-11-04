const Joi = require('joi');
const { PAYMENT_TYPE, REVIEW_STATUS, PAYMENT_STATUS, RECEIVER_TYPE } = require('./constants');

const ruleCreateOrUpdate = {
    receive_slip_id: Joi.number().allow([null]),
    receive_slip_code: Joi.string().required(),
    cashier_id: Joi.string().required(),
    total_money: Joi.number().min(0).required(),
    // payment_date: Joi.string(),
    notes: Joi.string().allow(['', null]),
    receive_type_id: Joi.number().required(),
    descriptions: Joi.string().allow(['', null]),
    is_active: Joi.number().valid([0, 1]),
    customer_id: Joi.number(),
    company_id: Joi.number().required(),
    business_id: Joi.number().required(),
    store_id: Joi.number().allow([null]),
    payment_type: Joi.number().valid(Object.values(PAYMENT_TYPE)).default(PAYMENT_TYPE.CASH),
    is_review: Joi.number().valid(Object.values(REVIEW_STATUS)),
    payment_status: Joi.number().valid(Object.values(PAYMENT_STATUS)),
    receiver_type: Joi.number().valid(Object.values(RECEIVER_TYPE)).required(),
    // receiver_id: Joi.number(),
    // receiver_name: Joi.string(),
    bank_account_id: Joi.number().allow([null]),
    is_deposit: Joi.number().valid([0, 1]),
    is_bookkeeping: Joi.number().valid([0, 1]),
    accounting_date: Joi.string(),
    payment_form_id: Joi.number().required(),
};

const validateRules = {
    createReceiveslip: {
        body: ruleCreateOrUpdate,
    },
    updateReceiveslip: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
