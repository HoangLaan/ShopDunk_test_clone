const express = require('express');
const validate = require('express-validation');
const controller = require('./email-history.controller');
const routes = express.Router();
const rules = require('./email-history.rule');
const prefix = '/email-history/';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

// Get detail
routes.route('/:email_history_id(\\d+)').get(controller.detail);

routes.route('/statistics').get(controller.getStatistics);

// webhook to update send status
routes.route('/webhook/update-status').post(controller.udpateMailStatus);

module.exports = {
    prefix,
    routes,
};
