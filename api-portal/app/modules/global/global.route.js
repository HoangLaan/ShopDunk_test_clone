const express = require('express');
const validate = require('express-validation');
const globalController = require('./global.controller');
const routes = express.Router();
const prefix = '/global';

// List
routes.route('/notify').get(globalController.getListNotify);
routes.route('/options').get(globalController.getOptionsGlobal);
routes.route('/get-full-name').get(globalController.getFullName);

module.exports = {
    prefix,
    routes,
};
