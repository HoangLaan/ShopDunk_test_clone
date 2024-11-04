const express = require('express');
const controller = require('./working-form.controller');
const routes = express.Router();
const prefix = '/working-form';

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
