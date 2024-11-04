const express = require('express');
const preOrderController = require('./pre-order.controller');
const routes = express.Router();
const prefix = '/pre-order';

routes.route('/payment/:preOrderId(\\d+)').post(preOrderController.createReceislipOrder);
//in phieu thu
routes.route('/export-pdf/:id(\\d+)').post(preOrderController.exportPDF);

routes.route('/get-order/:preorder_id(\\d+)').get(preOrderController.getOrderIdByPreorderId);

//Ký tên
routes.route('/signature/:preorder_id(\\d+)').put(preOrderController.updateSignature);

//Check số điện thoại đó đã mua sản phẩm đó hay chưa
routes.route('/check/product-bought-by-phone-number').get(preOrderController.checkProductBoughtByPhoneNumber);

module.exports = {
    prefix,
    routes,
};
