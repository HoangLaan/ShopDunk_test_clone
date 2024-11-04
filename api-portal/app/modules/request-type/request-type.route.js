const express = require('express');
const requestTypeController = require('./request-type.controller');
const validate = require('express-validation');
const validateRules = require('./request-type.rule');
const routes = express.Router();
const prefix = '/request-type';

routes.route('/get-options').get(requestTypeController.getOptions);

module.exports = {
    prefix,
    routes,
};
