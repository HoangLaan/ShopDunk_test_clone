const express = require('express');
const validate = require('express-validation');
const returnPolicyController = require('./return-policy.controller');
const routes = express.Router();
const rules = require('./return-policy.rule');
const prefix = '/return-policy';

routes.route('/product/:product_imei_code').get(validate(rules.getProduct), returnPolicyController.getProductDetails);

routes.route('/order').get(validate(rules.getOrder), returnPolicyController.getProductsByOrderNo);

module.exports = {
    prefix,
    routes,
};
