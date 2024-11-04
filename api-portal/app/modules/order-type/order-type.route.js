const express = require('express');
const validate = require('express-validation');
const orderTypeController = require('./order-type.controller');
const routes = express.Router();
const rules = require('./order-type.rule');
const prefix = '/order-type';

// Get List
routes.route('').get(orderTypeController.getListOrderType);

// Detail order type
routes.route('/:orderTypeId(\\d+)').get(orderTypeController.detailOrderType);

// Create order type
routes.route('').post(validate(rules.createOrderType), orderTypeController.createOrderType);

// Update order type
routes.route('/:orderTypeId(\\d+)').put(validate(rules.updateOrderType), orderTypeController.updateOrderType);

// Delete order type
routes.route('/delete').post(orderTypeController.deleteOrderType);

module.exports = {
    prefix,
    routes,
};
