const express = require('express');
const validate = require('express-validation');
const outputTypeController = require('./output-type.controller');
const routes = express.Router();
const rules = require('./output-type.rule');
const prefix = '/output-type';
// List
routes.route('').get(outputTypeController.getListOutputType);

// Change status
routes
    .route('/:output_type_id(\\d+)/change-status')
    .put(validate(rules.changeStatusOutputType), outputTypeController.changeStatusOutputType);

// Detail
routes.route('/:output_type_id(\\d+)').get(outputTypeController.detailOutputType);

// Create
routes.route('').post(validate(rules.createOutputType), outputTypeController.createOutputType);

// Update
routes.route('/:output_type_id(\\d+)').put(validate(rules.updateOutputType), outputTypeController.updateOutputType);

// Delete
routes.route('/delete').delete(outputTypeController.deleteOutputType);

// List options ward
routes.route('/get-options').get(outputTypeController.getOptions);

module.exports = {
    prefix,
    routes,
};
