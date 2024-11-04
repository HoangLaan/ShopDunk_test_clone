const express = require('express');
const validate = require('express-validation');
const rules = require('./invoice-management.rule');
const invoiceManagement = require('./invoice-management.controller');
const routes = express.Router();
const prefix = '/invoice-management';

routes.route('')
    .get(invoiceManagement.getList);

module.exports = {
    prefix,
    routes,
};
