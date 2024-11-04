const express = require('express');
// const validate = require('express-validation');
// const rules = require('./am-business.rule');
const amBusinessController = require('./am-business.controller');
const routes = express.Router();
const prefix = '/business';

// List options am-business
routes.route('/get-options')
  .get(amBusinessController.getOptions);

module.exports = {
  prefix,
  routes,
};
