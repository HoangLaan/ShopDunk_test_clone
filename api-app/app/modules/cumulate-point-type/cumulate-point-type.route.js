const express = require('express');
const validate = require('express-validation');
const rules = require('./cumulate-point-type.rule');
const controller = require('./cumulate-point-type.controller');

const routes = express.Router();

const prefix = '/cumulate-point-type';

// options
routes.route('/get-options').get(controller.getListOptions);

module.exports = {
    prefix,
    routes,
};
