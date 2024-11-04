const Joi = require('joi');

const ruleGetProduct = Joi.object().keys({
    product_id: Joi.number().required()
});

const validateRules = {
    getListStocks: {
        query: ruleGetListStocks,
    },
};

module.exports = validateRules;
