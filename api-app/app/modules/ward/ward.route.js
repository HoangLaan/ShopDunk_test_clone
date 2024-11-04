const express = require('express');
const wardController = require('./ward.controller');

const routes = express.Router();

const prefix = '/ward';

// List options ward
routes.route('/get-options')
  .get(wardController.getOptions);

  routes.route('/get-by-store')
.get(wardController.getByStore);

module.exports = {
  prefix,
  routes,
};
