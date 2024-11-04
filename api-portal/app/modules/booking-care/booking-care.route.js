const express = require('express');
const validate = require('express-validation');
const orderController = require('./booking-care.controller');
const routes = express.Router();
const rules = require('./booking-care.rule');
const prefix = '/appointments';

// List
routes
    .route('/')
    .get(orderController.getListBooking) // getlist
    .post(validate(rules.createBooking), orderController.createBooking); // insert

// Detail // get postman
routes
    .route('/:bookingId(\\d+)')
    .get(orderController.detail)
    .put(validate(rules.updateOrder), orderController.updateBooking); // update

// Lấy danh dich vu
routes.route('/get-parents-group-service').get(orderController.getParentsGroupServices);

routes.route('/customer-list').get(orderController.getListCustomer);

// lấy danh sách cửa hàng 
routes.route('/store/options').get(orderController.getListStoreByUser);

routes.route('/export-excel').post(orderController.exportExcel);

// Delete
routes.route('/delete-booking').delete(orderController.deleteBooking);

module.exports = {
    prefix,
    routes,
};


