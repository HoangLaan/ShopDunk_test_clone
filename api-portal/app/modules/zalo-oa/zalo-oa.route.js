const express = require('express');
const zaloOA = require('./zalo-oa.controller');
const rules = require('./zalo-oa.rule');
const validate = require('express-validation');

const routes = express.Router();

const prefix = '/zalo-oa';

routes.route('/info').get(zaloOA.getOAInfo);
routes.route('/send-text-message').post(validate(rules.sendTextMessage), zaloOA.sendTextMessage);
routes.route('/send-zns').post(validate(rules.sendZNS), zaloOA.sendZNS);
routes.route('/template').get(zaloOA.getListTemplate);
routes.route('/template/info').get(zaloOA.getTemplateById);

//zalo-pay
routes.route('/template-zalo-pay/info').get(zaloOA.getTemplateZaloPayById);
routes.route('/template-zalo-pay').get(zaloOA.getListTemplateZaloPay);
routes.route('/send-zns-zalo-pay').post(zaloOA.sendZNSZaloPay);

module.exports = {
    prefix,
    routes,
};
