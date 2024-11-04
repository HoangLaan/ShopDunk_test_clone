const express = require('express');
const controller = require('./onepay.controller');
const routes = express.Router();
const validate = require('express-validation');

const prefix = '/onepay';

routes.route('/installment-bank').get(controller.getInstallmentBank);

routes.route('/installment-hook').get(controller.getInstallmentTransaction);

module.exports = {
    prefix,
    routes,
};
