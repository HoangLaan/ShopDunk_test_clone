const express = require('express');
const validate = require('express-validation');
const controller = require('./trade-in-program.controller');
const routes = express.Router();
const rules = require('./trade-in-program.rule');
const prefix = '/trade-in-program';

routes.route('').get(controller.getList);

module.exports = {
    prefix,
    routes,
};
