const express = require('express');
const provinceController = require('./province.controller');

const routes = express.Router();

const prefix = '/province';

// List options province
routes.route('/get-options')
  .get(provinceController.getOptions);

routes.route('/get-by-store')
.get(provinceController.getByStore);

module.exports = {
  prefix,
  routes,
};
