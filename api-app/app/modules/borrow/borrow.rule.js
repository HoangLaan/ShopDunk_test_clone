const Joi = require('joi');

const ruleGetListStocks = Joi.object().keys({
    product_id: Joi.number().required(),
    page_size: Joi.number().required(),
    page_index: Joi.number().required(),
});

const createBorrowBody = Joi.object().keys({
    product_id: Joi.number().required(),
    borrow_stocks_id: Joi.number().required(),
    export_stocks_id: Joi.number().required(),
    quantity: Joi.number().required(),
    borrow_date_return: Joi.string().required(),
});

const validateRules = {
    getListStocks: {
        query: ruleGetListStocks,
    },
    create: {
        body: createBorrowBody,
    },
};

module.exports = validateRules;
