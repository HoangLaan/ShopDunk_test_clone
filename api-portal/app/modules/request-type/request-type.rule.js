const Joi = require('joi');

const ruleCreateOrUpdate = {
    is_active: Joi.number().valid(0, 1).required()
    
};

const validateRules = {
    createRequestType: {
        body: ruleCreateOrUpdate,
    },
    updateRequestType: {
        body: ruleCreateOrUpdate,
    }

}

module.exports = validateRules

