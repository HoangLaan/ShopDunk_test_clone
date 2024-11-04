const express = require('express');
const mailController = require('./meeting.controller');
const routes = express.Router();
const prefix = '/meeting';

routes.route('').post(mailController.pushNotification);

module.exports = {
  prefix,
  routes,
};
