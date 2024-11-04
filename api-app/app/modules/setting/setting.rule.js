const Joi = require('joi');

const checkBiometric = {
    publicKey: Joi.string(),
};

const validateRules = {
    checkBiometric: {
        body: checkBiometric,
    },
};

module.exports = validateRules;
