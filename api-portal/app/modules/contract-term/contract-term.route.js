const express = require('express');
const controller = require('./contract-term.controller');
const routes = express.Router();
const prefix = '/contract-term';

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
