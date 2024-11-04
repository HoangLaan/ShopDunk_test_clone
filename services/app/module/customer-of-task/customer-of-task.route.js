const express = require('express');
const routes = express.Router();
const customerOfTaskController = require('./customer-of-task.controller');
const prefix = '/customer-of-task';

routes.route('').post(customerOfTaskController.pushNotification);

module.exports = {
  prefix,
  routes,
};
