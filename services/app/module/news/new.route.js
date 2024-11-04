const express = require('express');
const mailController = require('./new.controller');
const routes = express.Router();
const prefix = '/news';

routes.route('').post(mailController.pushNotification);

module.exports = {
  prefix,
  routes,
};
