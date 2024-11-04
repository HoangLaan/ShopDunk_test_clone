const express = require('express');
const validate = require('express-validation');
const educationLevelController = require('./education-level.controller');
const routes = express.Router();
const prefix = '/education-level';


// List options education level
routes.route('/get-options')
  .get(educationLevelController.getOptions);

module.exports = {
  prefix,
  routes,
};
