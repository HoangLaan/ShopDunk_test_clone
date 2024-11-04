const Joi = require('joi');

const ruleCreateOrUpdate = {
    material_code: Joi.string().max(20).required(),
    material_name: Joi.string().required(),
    material_group_id: Joi.number().required(),
    description: Joi.string().allow('', null),
    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createMaterial: {
        body: ruleCreateOrUpdate,
    },
    updateMaterial: {
        body: ruleCreateOrUpdate,
    },
    createAttribute: {
        body: Joi.object().keys({
            attribute_name: Joi.string().required(),
        }),
    },
};

module.exports = validateRules;
