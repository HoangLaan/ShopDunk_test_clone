const express = require('express');
const validate = require('express-validation');
const productAttributeController = require('./product-attribute.controller');
const routes = express.Router();
const prefix = '/product-attribute';
const rules = require('./product-attribute.rule');

// Get list product attribute
routes.route('').get(productAttributeController.getListProductAttribute);

// Change status
routes
    .route('/:product_attribute_id(\\d+)/change-status')
    .put(validate(rules.changeStatusProductAttribute), productAttributeController.changeStatusProductAttribute);

// Get detail
routes.route('/:product_attribute_id(\\d+)').get(productAttributeController.detailProductAttribute);

// Get options product attribute
routes.route('/get-options').get(productAttributeController.getOptions);

// Create product attribute
routes.route('').post(validate(rules.createProductAttribute), productAttributeController.createProductAttribute);

// Update product attribute
routes
    .route('/:product_attribute_id(\\d+)')
    .put(validate(rules.updateProductAttribute), productAttributeController.updateProductAttribute);

// Delete product attribute
routes.route('/:product_attribute_id(\\d+)').delete(productAttributeController.deleteProductAttribute);

module.exports = {
    prefix,
    routes,
};
