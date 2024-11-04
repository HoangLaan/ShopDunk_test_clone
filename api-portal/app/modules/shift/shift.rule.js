const Joi = require('joi');

const ruleCreateOrUpdate = {
    shift_code: Joi.string().required(),
    shift_name: Joi.string().required(),
    time_start: Joi.string().required(),
    time_end: Joi.string().required(),
    time_checkin: Joi.string().required(),
    time_checkout: Joi.string().required(),
    numberofworkday: Joi.number().required(),
    is_active: Joi.number().valid(0, 1).required()
    
};

const validateRules = {
    createShift: {
        body: ruleCreateOrUpdate,
    },
    updateShift: {
        body: ruleCreateOrUpdate,
    }

}

module.exports = validateRules

