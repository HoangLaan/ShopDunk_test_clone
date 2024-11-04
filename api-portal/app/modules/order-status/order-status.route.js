const express = require('express');
const validate = require('express-validation');
const orderStatusController = require('./order-status.controller');
const routes = express.Router();
const rules = require('./order-status.rule');
const prefix = '/order-status';

routes
    .route('')
    .get(orderStatusController.getListOrderStatus)
    .post(validate(rules.createOrderStatus), orderStatusController.createOrUpdateOrderStatus)
    .put(validate(rules.updateOrderStatus), orderStatusController.createOrUpdateOrderStatus)
    .delete(orderStatusController.deleteOrderStatus);

// Detail order status
routes.route('/:orderStatusId(\\d+)').get(orderStatusController.detailOrderStatus);

// Get options
routes.route('/get-options').get(orderStatusController.getOptions);

routes.route('/information-orders').get(orderStatusController.getInformationWithOrder);

module.exports = {
    prefix,
    routes,
};
