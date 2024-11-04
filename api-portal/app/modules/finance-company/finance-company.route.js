const express = require('express');
const validate = require('express-validation');
const controller = require('./finance-company.controller');
const routes = express.Router();
const rules = require('./finance-company.rule');
const prefix = '/finance-company';

routes.route('').get(controller.getList);

module.exports = {
    prefix,
    routes,
};
