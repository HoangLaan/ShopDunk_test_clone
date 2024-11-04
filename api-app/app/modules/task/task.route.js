const express = require('express');
const validate = require('express-validation');
const controller = require('./task.controller');
const routes = express.Router();
const rules = require('./task.rule');
const prefix = '/task';

// Task type options
routes.route('/task-type/get-options').get(controller.getTaskTypeOptions);

// Task type auto options
routes.route('/task-type-auto/get-options').get(controller.getTaskTypeAutoOptions);

module.exports = {
    prefix,
    routes,
};
