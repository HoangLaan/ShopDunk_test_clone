const Joi = require('joi');

const ruleCreateOrUpdate = {
    // stocks_code: Joi.string().required(),
    // stocks_name: Joi.string().required(),
};

const ruleCreateOrUpdateStocksManager = {};

const validateRules = {
    createStocks: {
        body: ruleCreateOrUpdate,
    },
    createStocksStocksManager: {
        body: ruleCreateOrUpdateStocksManager,
    },
    updateStocks: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
