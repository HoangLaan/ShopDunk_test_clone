const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    request_using_budget_code: Joi.string().required(),
    user_request: Joi.string().required(),
    department_id: Joi.number().required(),
    company_id: Joi.number().required(),
    budget_type_id: Joi.number().required(),
    list_budget_goal: Joi.array().required(),
    list_review: Joi.array().required(),
    is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
};

const validateRules = {
    create: {
        body: ruleCreateUpdate,
    },
    update: {
        body: ruleCreateUpdate,
    },
    status: {
        body: {
            is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
        },
    },
};

module.exports = validateRules;
