const express = require('express');
const validate = require('express-validation');
const orderController = require('./order.controller');
const routes = express.Router();
const rules = require('./order.rule');
const prefix = '/order';

// Lay danh sach don hang
routes.route('').get(orderController.getListOrder).post(orderController.createOrder); // insert

//lay trang thai don hang
routes.route('/order-status/options').get(orderController.getOrderStatusOptions);

// Detail // get postman
routes.route('/:orderId(\\d+)').get(orderController.detailOrder).put(orderController.updateOrder); // update

// Export PDF
routes.route('/export-pdf/:order_id(\\d+)').get(orderController.exportPDF);

// Generate price quote no
routes.route('/code').get(orderController.createOrderNo);

// Delete
routes.route('/delete-orders').delete(orderController.deleteOrder);

// cancel
routes.route('/:orderId(\\d+)/cancel').put(orderController.cancelOrder);

// get detail order by orderno
routes.route('/no/:order_no').get(orderController.getDetailOrderByOrderNo);

// lấy đơn hàng phiếu thu
routes.route('/receiveslip/:order_id(\\d+)').get(orderController.getDetailOrderForReceiveslip);

// Lay danh sach chuong trinh khuyen mai duoc ap dung
routes.route('/promotion').get(orderController.getListPromotion);

// Lay danh sach san pham tren kho
routes.route('/product').get(orderController.getListProductByStore);

// lấy danh sách nhân viên thuộc cùng phong ban với user login
// lấy để tính hoa hồng
routes.route('/option-user').get(orderController.getOptionUser);

// lấy danh sách ngân hàng
routes.route('/bank-account/get-options').get(orderController.getBankAccountOptions);

// lấy danh sách cửa hàng của nhân viên
routes.route('/store/options').get(orderController.getListStoreByUser);

// ds loai don hang
routes.route('/order-type/options').get(orderController.getOrderTypeOptions);

//Lấy sản phẩm khi quét mã IMEI
routes.route('/product/imei').get(orderController.getDetailProductByImei);

//Lấy thông tin ca làm việc của nhân viên đăng nhập
routes.route('/shift-info').get(orderController.getShiftInfo);

//Thanh toán đơn hàng
routes.route('/payment/:orderId(\\d+)').put(orderController.paymentOrder);

//Lấy coupon
routes.route('/coupon').get(orderController.getCoupon);

//Lấy chương trình đổi điểm
routes.route('/exchange-point').get(orderController.getExchangePoint);

//Ký tên
routes.route('/signature/:orderId(\\d+)').put(orderController.updateSignature);

//Cập nhật trạng thái của đơn hàng
routes.route('/order-status/:order_id(\\d+)').put(orderController.updateOrderStatus);

//Check phiếu thu khi thanh toán bằng tài khoản ngân hàng
routes.route('/check-receive-slip').get(orderController.checkReceiveSlip);

routes.route('/payment-pos').post(orderController.paymentOrderPos);

// in preOrder
routes.route('/export-pre-order').get(orderController.exportPreOrderPdf);

// get preOrder coupon
routes.route('/pre-order-coupon').get(orderController.getPreOrderCoupon);

// check exist order
routes.route('/check-exist-order').get(orderController.checkOrderExistFromPreOrder);

module.exports = {
    prefix,
    routes,
};
