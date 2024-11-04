const Joi = require('joi');

const ruleCreateOrUpdate = {
    stocks_code: Joi.string().required(),
    stocks_name: Joi.string().required()
};

const ruleCreateOrUpdateStocksManager = {
    
};

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
    // changeStatusAccountingPeriod: {
    //     body: {
    //         is_active: Joi.number().valid(0, 1).required(),
    //     },
    // },
    // checkOrderIndex: {
    //     body: {
    //         order_index: Joi.number().required(),
    //     },
    // },
};

module.exports = validateRules;
