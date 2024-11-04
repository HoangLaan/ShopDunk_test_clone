const Joi = require('joi');

const productDetails = {
    product_imei_code: Joi.string().required(),
};

const orderDetail = {
    no: Joi.string().required(),
    t: Joi.string().allow(0, 1, 2),
};

const validateRules = {
    getProduct: {
        params: productDetails,
    },
    getOrder: {
        query: orderDetail,
    },
};

module.exports = validateRules;
