const Joi = require('joi');

const ruleAttribute = Joi.object().keys({
    attribute_values_id: Joi.number().allow(null, ''),
    attribute_values: Joi.string().allow(null, ''),
    attribute_description: Joi.string().allow(null, ''),
});
const ruleCreateOrUpdate = Joi.object().keys({
    unit_id: Joi.number().allow(null, ''),
    attribute_name: Joi.string().required(),
    attribute_description: Joi.string().allow(null, ''),
    is_active: Joi.number().valid(0, 1).required(),
    attribute_values: Joi.array().allow(null).items(ruleAttribute),
});

const rulechangeStatus = {
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createProductAttribute: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    updateProductAttribute: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    changeStatusProductAttribute: rulechangeStatus,
};

module.exports = validateRules;
