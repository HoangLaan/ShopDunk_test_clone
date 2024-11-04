const express = require('express');
const controller = require('./misa-invoice.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./misa-invoice.rule');

const prefix = '/misa-invoice';

// lấy danh sách mẫu hóa đơn
routes.route('/template').get(controller.getTemplates);

// Tạo, ký và phát hành hóa đơn với HSM
routes.route('/publish-with-hsm').post(validate(rules.publishHsm), controller.publishHSM);

// Lấy trạng thái hóa đơn bằng orderno của đơn hàng
routes.route('/:orderno').get(controller.getInvoiceByRefId);

// Xem hóa đơn bằng orderno của đơn hàng
routes.route('/view/:transaction_id').get(controller.viewInvoiceByTransactionId);

// Gửi mail đến khách hàng
routes.route('/send-mail').post(validate(rules.sendMail), controller.sendMailToCustomer);

// Hủy hóa đơn
routes.route('/cancle').post(validate(rules.cancelInvoice), controller.cancelInvoice);

// Tải hóa đơn
routes.route('/dowload/:transaction_id').post(controller.dowloadInvoice);

// Lưu hóa đơn
routes.route('/save-invoice').post(validate(rules.saveInvoice), controller.saveInvoice);

// Xem hóa đơn nháp
routes.route('/view-demo').post(validate(rules.viewDemo), controller.viewDemoInvoice);

// xem phiếu xuất kho nháp
routes.route('/view-demo-transport').post(validate(rules.viewStocksOut), controller.viewStocksOut);

// xuất phiếu xuất kho
routes.route('/publish-transport-hsm').post(validate(rules.publishTransportHSM), controller.publishTransportHSM);

module.exports = {
    prefix,
    routes,
};
