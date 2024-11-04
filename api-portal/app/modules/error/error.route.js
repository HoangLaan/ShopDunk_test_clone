const express = require('express');
const errorController = require('./error.controller');

const routes = express.Router();

const prefix = '/error';

module.exports = {
  prefix,
  routes,
};
