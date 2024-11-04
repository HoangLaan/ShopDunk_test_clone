const express = require('express');
const controller = require('./payment.controller');
const prefix = '/payment';
const routes = express.Router();
// List by store
routes.route('/vnpay-ipn').post(controller.listenVNPayIPN);

// List by store
routes.route('/onepay-ipn').post(controller.listenOnePayIPN);

//Thanh toán đơn hàng
routes.route('/order/:orderId(\\d+)').put(controller.paymentOrder);

//Thanh toán đơn hàng
routes.route('/order/transaction-vcb/:orderId(\\d+)').post(controller.saveTransactionVCBPOS);

//Thanh toán đơn hàng
routes.route('/order/transaction-vnpay/:orderId(\\d+)').post(controller.saveTransactionVNPayPOS);

module.exports = {
    prefix,
    routes,
};
