const express = require('express');
const validate = require('express-validation');
const brandController = require('./brand.controller');
const routes = express.Router();
const rules = require('./brand.rule');
const prefix = '/brand';

// options company
routes.route('/get-options').get(brandController.getOptionsBrand);
// List
routes.route('').get(brandController.getListBrand);

// Detail
routes.route('/:brand_id(\\d+)').get(brandController.detailBrand);

// Create
routes.route('').post(validate(rules.createBrand), brandController.createBrand);

// Update
routes.route('/:brand_id(\\d+)').put(validate(rules.updateBrand), brandController.updateBrand);

// Delete
routes.route('/delete').delete(brandController.deleteBrand);

// options company
routes.route('/company-options').get(brandController.getOptionsCompany);

module.exports = {
    prefix,
    routes,
};
