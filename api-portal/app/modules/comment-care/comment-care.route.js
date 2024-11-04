const express = require('express');
const validate = require('express-validation');
const controller = require('./comment-care.controller');
const routes = express.Router();
const rules = require('./comment-care.rule');
const prefix = '/comment';

// Listing
routes.route('/').get(controller.getListComment); // get list
//.post(validate(rules.createComment), controller.createComment); // insert

// Detail
routes.route('/:id(\\d+)').get(controller.details);
//.put(validate(rules.update), controller.updateComment); // update

// Change status
routes.route('/:customer_comment_id(\\d+)/change-status').put(controller.changeStatus);

// Export
routes.route('/export-excel').post(controller.exportExcel);

module.exports = {
    prefix,
    routes,
};
