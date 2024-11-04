const express = require('express');
const controller = require('./product-inventory-lookup.controller');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const rules = require('./product-inventory-lookup.rule');

const routes = express.Router();

const prefix = '/product-inventory-lookup';

// get list product
routes.route('/').get(schemaMiddleWare(rules.getList), controller.getListProduct);

// get product by id
routes.route('/get-by-id/:product_id').get(schemaMiddleWare(rules.getById), controller.getProductById);

// get product by code
routes.route('/get-by-code').get(schemaMiddleWare(rules.getByCode), controller.getProductByCode);

module.exports = {
    prefix,
    routes,
};
