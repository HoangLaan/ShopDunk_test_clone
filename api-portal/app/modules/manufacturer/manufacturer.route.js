const express = require('express');
const manufacturerController = require('./manufacturer.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./manufacturer.rule');

const prefix = '/manufacturer';

// List
routes.route('').get(manufacturerController.getListManufacturer);

// Detail
routes.route('/:manufacturer_id(\\d+)').get(manufacturerController.detailManufacturer);

// Create
routes.route('').post(validate(rules.createManufacturer), manufacturerController.createManufacturer);

// Update
routes
    .route('/:manufacturer_id(\\d+)')
    .put(validate(rules.updateManufacturer), manufacturerController.updateManufacturer);

// Change status
routes
    .route('/:manufacturer_id(\\d+)/change-status')
    .put(validate(rules.changeStatusManufacturer), manufacturerController.changeStatusManufacturer);

// Delete
routes.route('').delete(manufacturerController.deleteManufacturer);

// List options Manufacturer
routes.route('/get-options').get(manufacturerController.getOptions);

module.exports = {
    prefix,
    routes,
};
