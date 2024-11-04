const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    equipment_group_id: Joi.number().allow(null),
    equipment_group_name: Joi.string().required(),
    equipment_group_code: Joi.string().required(),
    parent_id: Joi.number().allow(null),
    description: Joi.string().allow('', null),
    is_active: Joi.number().valid(0, 1).required(),
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
