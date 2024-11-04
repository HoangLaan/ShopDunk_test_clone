const express = require('express');
const validate = require('express-validation');
const controller = require('./accounting-period.controller');
const routes = express.Router();
const rules = require('./accounting-period.rule');
const prefix = '/accounting-period/';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getListAccountingPeriod)
    .post(validate(rules.create), controller.createAccountingPeriod)
    .put(validate(rules.update), controller.udpateAccountingPeriod)
    .delete(controller.deleteListAccountingPeriod);

// Get detail
routes.route('/:accounting_period_id(\\d+)').get(controller.detailAccountingPeriod);

module.exports = {
    prefix,
    routes,
};
