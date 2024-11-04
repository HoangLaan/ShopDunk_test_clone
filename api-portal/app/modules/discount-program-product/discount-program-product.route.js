const express = require('express');
const validate = require('express-validation');
const rules = require('./discount-program-product.rule');
const discountProgramProductController = require('./discount-program-product.controller');

const routes = express.Router();
const prefix = '/discount-program-product';

routes.route('').get(discountProgramProductController.getListDiscountProgramProduct);
routes.route('/products').get(discountProgramProductController.getDetailProduct);
routes.route('/export-excel').get(discountProgramProductController.exportExcel);
routes.route('/manufacturer-options').get(discountProgramProductController.getManufacturerOptions);
routes.route('/product-options').get(discountProgramProductController.getProductOptions);

module.exports = {
    prefix,
    routes,
};
