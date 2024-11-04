const Joi = require('joi');

const ruleCreateOrUpdate = {
    document_type_name: Joi.string().required(),
    description: Joi.string().allow('', null),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createDocumentType: {
        body: ruleCreateOrUpdate,
    },
    updateDocumentType: {
        body: ruleCreateOrUpdate,
    },
    changeStatusDocumentType: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
