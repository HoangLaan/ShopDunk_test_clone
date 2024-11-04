const express = require('express');
const validate = require('express-validation');
const supplierController = require('./supplier.controller');
const routes = express.Router();
const rules = require('./supplier.rule');
const prefix = '/supplier';

// List supplier
routes.route('').get(supplierController.getListSupplier);

// Create new supplier
routes.route('').post(validate(rules.createSupplier), supplierController.createSupplier);

// Update supplier
routes.route('/:supplier_id(\\d+)').put(validate(rules.updateSupplier), supplierController.updateSupplier);

// Detail a area
routes.route('/:supplier_id(\\d+)').get(supplierController.detailSupplier);

// Delete supplier
routes.route('').delete(supplierController.deleteSupplier);

// Change status supplier
routes
    .route('/:supplier_id(\\d+)/change-status')
    .put(validate(rules.changeStatusSupplier), supplierController.changeStatusSupplier);

// List options supplier
routes.route('/get-options').get(supplierController.getOptions);

module.exports = {
    prefix,
    routes,
};
