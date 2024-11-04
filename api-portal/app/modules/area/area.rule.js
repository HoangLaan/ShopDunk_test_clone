const Joi = require('joi');

const ruleCreateOrUpdate = {
    area_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createArea: {
        body: ruleCreateOrUpdate,
    },
    updateArea: {
        body: ruleCreateOrUpdate,
    },
    changeStatusArea: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
