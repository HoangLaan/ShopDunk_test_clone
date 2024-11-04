const express = require('express');
const validate = require('express-validation');
const rules = require('./functionGroup.rule');
const functionGroupController = require('./functionGroup.controller');

const routes = express.Router();

const prefix = '/function-group';

// List Function Group
routes.route('').get(functionGroupController.getListFunctionGroup);

// Create new a Function Group
routes.route('').post(validate(rules.create), functionGroupController.createFunctionGroup);

// List options district
routes.route('/get-options').get(functionGroupController.getOptions);

// Update a Function Group
routes.route('/:id').put(validate(rules.update), functionGroupController.updateFunctionGroup);

// Delete a Function Group
routes.route('').delete(functionGroupController.deleteFunctionGroup);

// Detail a Function Group
routes.route('/:id').get(functionGroupController.detailFunctionGroup);

// Update Status
routes.route('/:id/status').put(validate(rules.status), functionGroupController.updateStatus);

module.exports = {
    prefix,
    routes,
};
