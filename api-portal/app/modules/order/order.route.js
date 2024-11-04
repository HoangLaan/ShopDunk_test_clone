const express = require('express');
const validate = require('express-validation');
const orderController = require('./order.controller');
const routes = express.Router();
const rules = require('./order.rule');
const prefix = '/order';

// List
routes
    .route('/')
    .get(orderController.getListOrder) // getlist
    .post(validate(rules.createOrder), orderController.createOrder); // insert

// Detail // get postman
routes
    .route('/:orderId(\\d+)')
    .get(orderController.detailOrder)
    .put(validate(rules.updateOrder), orderController.updateOrder); // update

// Export PdexportPDF
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
routes.route('/promotion').post(orderController.getListPromotion);

// Lay khuyen mai theo ma
routes.route('/coupon').post(orderController.getCoupon);

// Lay danh sach san pham tren kho
routes.route('/stocks/:stocks_id(\\d+)/products').get(orderController.getListProductInStock);

// Xuat file excel
routes.route('/export-excel').get(orderController.exportExcel);

// lấy danh sách nhân viên thuộc cùng phong ban với user login
// lấy để tính hoa hồng
routes.route('/option-user').get(orderController.getOptionUser);

// lấy danh sách ngân hàng
routes.route('/bank-account/get-options').get(orderController.getBankAccountOptions);

// lấy danh sách cửa hàng của nhân viên
routes.route('/store/options').get(orderController.getListStoreByUser);

// lấy danh sách nhân viên theo cửa hàng
routes.route('/store/sale').get(orderController.getListStoreBySale);

// lấy sản phẩm theo imei
routes.route('/product').get(orderController.getProduct);

//Thanh toán đơn hàng
routes.route('/payment/:orderId(\\d+)').put(orderController.paymentOrder);

// Lấy danh sách loại đơn hàng theo quyền
routes.route('/order-type').get(orderController.getListOrderType);

// Thanh toán tiền mặt
routes.route('/cash-payment').post(validate(rules.cashPayment), orderController.cashPayment);

// Lấy lịch sử thanh toán
routes.route('/payment-history/:order_id(\\d+)').get(orderController.getPaymentHistory);

// Lấy danh sách túi, bao bì theo của hàng
routes.route('/material').get(orderController.getListMaterial);

// Lấy ds sản phẩm
routes.route('/customer-list').get(orderController.getListCustomer);

// Kiểm tra trạng thái đơn hàng thay đổi và gửi sms email zalo
routes
    .route('/check-order-status-notify')
    .post(validate(rules.checkOrderStatusToNotify), orderController.checkOrderStatusToNotify);

// in preOrder
routes.route('/export-pre-order/:order_id(\\d+)').get(orderController.exportPreOrderPdf);

// get preOrder coupon
routes.route('/pre-order-coupon').get(orderController.getPreOrderCoupon);

// get product report
routes.route('/product-report').post(orderController.getProductReport);

// get report chart
routes.route('/report-chart').post(orderController.getReportChart);

// lấy đơn hàng của khách hàng
routes.route('/count-by-customer').get(orderController.countByCustomer);

routes.route('/business-info').get(orderController.getBusinessInfo);

routes.route('/installment-status').put(orderController.updateInstallmentOrder);

// lấy điều khoản thanh toán
routes.route('/payment-policy').get(orderController.getPaymentPolicy);

routes.route('/export-excel-order').get(orderController.ExportExcelOrder);

routes.route('/invoice-link/:order_id(\\d+)').post(orderController.updateInvoiceLink);

routes.route('/user-review-options').get(orderController.getUserReviewOptions);

routes.route('/create-order-review').put(orderController.createOderReview);

routes.route('/list-images-order-review').get(orderController.getListImageOrderReview);

module.exports = {
    prefix,
    routes,
};
