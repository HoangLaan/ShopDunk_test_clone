const express = require('express');
const validate = require('express-validation');
const rules = require('./rs-error.rule');
const rsErrorController = require('./rs-error.controller');
const routes = express.Router();
const prefix = '/rs-error';

routes.route('').get(rsErrorController.getListRsError);

module.exports = {
    prefix,
    routes,
};
