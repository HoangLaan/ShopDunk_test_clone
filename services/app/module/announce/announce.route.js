const express = require('express');
const announceController = require('./announce.controller');
const routes = express.Router();
const prefix = '/announce';

routes.route('').post(announceController.pushNotification);

module.exports = {
  prefix,
  routes,
};
