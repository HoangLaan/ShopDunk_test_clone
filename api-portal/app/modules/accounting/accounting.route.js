const express = require('express');
const validate = require('express-validation');
const controller = require('./accounting.controller');
const routes = express.Router();
const rules = require('./accounting.rule');
const prefix = '/accounting';

// Get list
routes.route('').get(controller.getList);

// Get detail
routes.route('/:accounting_id(\\d+)').get(controller.detail);

module.exports = {
    prefix,
    routes,
};
