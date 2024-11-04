const Joi = require('joi');

const ruleCreateOrUpdate = {
    manufacturer_name: Joi.string().required(),
    manufacturer_address: Joi.string().allow(''),
    email: Joi.string().allow(''),
    website: Joi.string().allow(''),
    phone_number: Joi.string().allow(''),
    descriptions: Joi.string().allow(''),
    is_active: Joi.number().valid(0, 1).required(),
};

const rulechangeStatus = {
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createManufacturer: ruleCreateOrUpdate,
    updateManufacturer: ruleCreateOrUpdate,
    changeStatusManufacturer: rulechangeStatus,
};

module.exports = validateRules;
