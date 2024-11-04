const express = require('express');
const validate = require('express-validation');
const rules = require('./function.rule');
const functionController = require('./function.controller');

const routes = express.Router();

const prefix = '/function';

// List function
routes.route('').get(functionController.getListFunction);

// Create new a function
routes.route('').post(validate(rules.createFunction), functionController.createFunction);

// Update a function
routes.route('/:functionId(\\d+)').put(validate(rules.updateFunction), functionController.updateFunction);

// Delete a function
routes.route('/:functionId(\\d+)').delete(functionController.deleteFunction);

// Delete a functions
routes.route('/').delete(validate(rules.deleteFunctionList), functionController.deleteListFunction);

// Detail a function
routes.route('/:functionId(\\d+)').get(functionController.detailFunction);

// Change status a function
routes
    .route('/:functionId(\\d+)/change-status')
    .put(validate(rules.changeStatusFunction), functionController.changeStatusFunction);

// List options function
routes.route('/get-options').get(functionController.getOptions);

// List options function
routes.route('/functions-by-user-group').get(functionController.getListFunctionsByUserGroup);

module.exports = {
    prefix,
    routes,
};
