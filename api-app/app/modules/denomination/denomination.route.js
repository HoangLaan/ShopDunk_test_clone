const express = require('express');
const controller = require('./denomination.controller');
const routes = express.Router();
const prefix = '/denomination';
// const validate = require('express-validation');
// const rules = require('./department.rule');

// List
routes.route('/').get(controller.getListDenomination);

module.exports = {
    prefix,
    routes,
};
