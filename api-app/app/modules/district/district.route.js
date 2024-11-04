const express = require('express');
const districtController = require('./district.controller');

const routes = express.Router();

const prefix = '/district';

// List options district
routes.route('/get-options')
  .get(districtController.getOptions);

  routes.route('/get-by-store')
.get(districtController.getByStore);

module.exports = {
  prefix,
  routes,
};
