const express = require('express');
const validate = require('express-validation');
const paymentController = require('./payment-vietinbank.controller');
const routes = express.Router();
const rules = require('./payment-vietinbank.rule');
const prefix = '/payment-vietinbank';

// Kiểm tra và cập nhật lại trạng thái của phiếu thu khi thanh toán qua ngân hàng
routes.route('/check-receive-slip')
    .post(paymentController.checkReceiveSlip);

module.exports = {
    prefix,
    routes,
};
