const express = require('express');
const validate = require('express-validation');
const producCategoryController = require('./product-category.controller');
const routes = express.Router();
const rules = require('./product-category.rule');
const prefix = '/product-category';

// List and Crate product category
routes
    .route('')
    .get(producCategoryController.getList)
    .post(validate(rules.create), producCategoryController.createProductCategory);

// Detail, Update a product category
routes
    .route('/:productCategoryId(\\d+)')
    .get(producCategoryController.detail)
    .put(validate(rules.update), producCategoryController.updateProductCategory);

// Get list product attribute of product category
routes.route('/:productCategoryId(\\d+)/attributes/get-options').get(producCategoryController.getOptionsAttribute);

// Get options product models of product category
routes
    .route('/:productCategoryId(\\d+)/product-model/get-options')
    .get(producCategoryController.getOptionsProductModel);

// Delete many product category
routes.route('/delete').post(producCategoryController.deleteProductCategory);

// List options product category
routes.route('/get-options').get(producCategoryController.getOptions);

// Get options  for create
routes.route('/get-options-treeview').get(producCategoryController.getOptionTreeview);

// Export excel
routes.route('/export-excel').get(producCategoryController.exportExcel);

// Get list attributes
// Create new attribute
routes
    .route('/attributes')
    .get(producCategoryController.getListAttributes)
    .post(validate(rules.createAttribute), producCategoryController.createAttribute);

// Get detail material
routes.route('/material/:material_id(\\d+)').get(producCategoryController.getMaterialById);

module.exports = {
    prefix,
    routes,
};
