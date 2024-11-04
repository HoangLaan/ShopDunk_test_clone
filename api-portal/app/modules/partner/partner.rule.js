const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    partner_name: Joi.string().required(),
    phone_number: Joi.required(),
    email: Joi.required(),
    is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
    is_system: Joi.number().valid(API_CONST.ISSYSTEM.SYSTEM, API_CONST.ISSYSTEM.NOT_SYSTEM).required(),
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