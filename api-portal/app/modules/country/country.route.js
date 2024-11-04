const express = require('express');
const countryController = require('./country.controller');

const routes = express.Router();

const prefix = '/country';

// List options country
routes.route('/get-options').get(countryController.getOptions);

module.exports = {
    prefix,
    routes,
};
