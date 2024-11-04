const express = require('express');
const validate = require('express-validation');
const controller = require('./email-list.controller');
const routes = express.Router();
const rules = require('./email-list.rule');
const prefix = '/email-list/';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

// Get detail
routes.route('/:email_list_id(\\d+)').get(controller.detail);

module.exports = {
    prefix,
    routes,
};
