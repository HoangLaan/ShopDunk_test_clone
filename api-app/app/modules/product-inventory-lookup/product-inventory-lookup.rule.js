const Joi = require('joi');

const validateRules = {
    getList: {
        page: Joi.number().integer().min(1).default(1),
        itemsPerPage: Joi.number().integer().min(1).default(10),
        search: Joi.string().allow(''),
    },
    getById: {
        product_id: Joi.number().integer().min(1).required(),
    },
    getByCode: {
        code: Joi.string().required(),
    },
};

module.exports = validateRules;
