const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    work_flow_name: Joi.string().required(),
    work_flow_code: Joi.string().required(),
    color: Joi.string().required(),
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
};

module.exports = validateRules;
