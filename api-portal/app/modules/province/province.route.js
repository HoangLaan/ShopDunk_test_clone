const express = require('express');
const provinceController = require('./province.controller');

const routes = express.Router();

const prefix = '/province';

// List options province
routes.route('/get-options')
  .get(provinceController.getOptions);

module.exports = {
  prefix,
  routes,
};
