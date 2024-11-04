const express = require('express');
const validate = require('express-validation');
const controller = require('./sms-brandname.controller');
const routes = express.Router();
const prefix = '/sms-brandname';
const rules = require('./sms-brandname.rule');

// Hàm số dư tài khoản
routes.route('/').post(controller.getBalance);

// Hàm kiểm tra trạng thái tin nhắn theo khoảng thời gian
routes.route('/status').post(validate(rules.status), controller.getSmsSentData_V1);

// Hàm kiểm tra tin nhắn theo SMSID
routes.route('/').get(controller.getSendStatus);

// Hàm lấy danh sách Brandname
routes.route('/brandname').get(controller.getListBrandname);

// Hàm lấy danh sách template tin chăm sóc khách hàng
routes.route('/template').post(controller.getTemplate);

// Gửi tin Chăm sóc khách hàng (TypeSMS 2)
routes
    .route('/send-customer-care-message')
    .post(validate(rules.sendCustomerCareMessage), controller.sendMultipleMessage_V4_post_json);

module.exports = {
    prefix,
    routes,
};
