const Joi = require('joi');
const {trim} = require('lodash');

const ruleCreateOrUpdate = {
    expend_type_code: Joi.string().trim().required().max(20),
    expend_type_name: Joi.string().trim().required().max(250),
    company_id: Joi.number().required(),
    business_id_list: Joi.array().items(Joi.number()).required(),
    description: Joi.string().allow(null, '').max(2000),
    note: Joi.string().allow(null, '').max(2000),
};

const validateRules = {
    createExpendType: {
        body: ruleCreateOrUpdate,
    },
    updateExpendType: {
        body: ruleCreateOrUpdate,
    },
    createReviewLevel: {
        body: {
            company_id: Joi.number().required(),
            review_level_name: Joi.string().required(),
        },
    },
};

module.exports = validateRules;
