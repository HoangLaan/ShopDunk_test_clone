const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {};

const validateRules = {
    create: {
        body: ruleCreateUpdate,
    },
    update: {
        body: ruleCreateUpdate,
    },
};

module.exports = validateRules;
