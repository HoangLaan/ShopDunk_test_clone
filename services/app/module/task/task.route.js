const express = require('express');
const routes = express.Router();
const taskController = require('./task.controller');
const prefix = '/task';

routes.route('/comment').post(taskController.pushNotification);
routes.route('/change-work-flow').post(taskController.pushNotifyChangeWFlow);

module.exports = {
  prefix,
  routes,
};
