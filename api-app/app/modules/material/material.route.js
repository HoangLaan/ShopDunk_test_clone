const express = require('express');
const controller = require('./material.controller');
const prefix = '/material';
const routes = express.Router();
// List material by product
routes.route('/get-by-product').get(controller.getListByProduct);

// List material
routes.route('').get(controller.getList)

module.exports = {
    prefix,
    routes,
};