const express = require('express');
const notifyController = require('./notify.controller');
const routes = express.Router();
const prefix = '/notify';

// Get List
routes.route('').get(notifyController.getList);
routes.route('/read').post(notifyController.updateReadNotify);
routes.route('/many-read').get(notifyController.updateReadAllNotify);

module.exports = {
    prefix,
    routes,
};
