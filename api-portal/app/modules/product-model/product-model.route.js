const express = require('express');
const validate = require('express-validation');
const productModelController = require('./product-model.controller');
const routes = express.Router();
const rules = require('./product-model.rule');
const prefix = '/product-model';

// List and create product model
routes
    .route('')
    .get(productModelController.getList)
    .post(validate(rules.create), productModelController.createProductModel);

// Detail, Update a product model
routes
    .route('/:productModelId(\\d+)')
    .get(productModelController.detail)
    .put(validate(rules.update), productModelController.updateProductModel);

// Delete many product model
routes.route('/delete').post(productModelController.deleteProductModel);

// List options product model
routes.route('/get-options').get(productModelController.getOptions);

// Export excel
routes.route('/export-excel').get(productModelController.exportExcel);

// Create attribute
routes.route('/attributes').post(validate(rules.createAttribute), productModelController.createAttribute);

// Get attribute detail
routes.route('/attributes/:product_attribute_id(\\d+)').get(productModelController.getAttributeDetail);

// Default Account
routes.route('/accounting-options').get(productModelController.getAccountingAccountOptions);

module.exports = {
    prefix,
    routes,
};
