const Joi = require('joi');

const ruleCreateOrUpdate = {
    other_acc_voucher_id: Joi.number().integer().allow([null, '']),
    total_money: Joi.number().integer().required(),
    other_acc_voucher_code: Joi.string().required(),
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
