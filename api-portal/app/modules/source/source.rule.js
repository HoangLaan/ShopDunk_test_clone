const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    source_name: Joi.string().required(),
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
