const express = require('express');
const versionController = require('./version.controller');

const routes = express.Router();

const prefix = '/version';

routes.route('/get-version')
  .get(versionController.getVersion);

module.exports = {
  prefix,
  routes,
};
