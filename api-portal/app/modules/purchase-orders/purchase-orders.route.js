const express = require('express');
const validate = require('express-validation');
const purchaseOrdersController = require('./purchase-orders.controller');
const routes = express.Router();
const rules = require('./purchase-orders.rule');
const prefix = '/purchase-orders';

// List
routes.route('').get(purchaseOrdersController.getListPurchaseOrder);

// List Retuned
routes.route('/returned').get(purchaseOrdersController.getListPurchaseOrderReturned);

routes.route('/get-store-options').get(purchaseOrdersController.getStoreOptions);
routes.route('/list-customer/deboune').get(purchaseOrdersController.getListCustomerDeboune);

//create
routes.route('').post(purchaseOrdersController.createPurchaseOrder);

//detail
routes.route('/:purchase_order_id(\\d+)').get(purchaseOrdersController.detailPurchaseOrder);

// detail do + po
routes.route('/get-do-po/:purchase_order_id(\\d+)').get(purchaseOrdersController.getDoAndPo);

// detail do + po multi
routes.route('/get-do-po-multi').get(purchaseOrdersController.getDoAndPoMulti);

//update
routes.route('').put(purchaseOrdersController.updatePurchaseOrder);

//delete
routes.route('').delete(purchaseOrdersController.deletePurchaseOrder);

//Gen ID
routes.route('/get-id').get(purchaseOrdersController.getPurchaseOrderId);

//detail List
routes.route('/list-detail').post(purchaseOrdersController.detailListPurchaseOrder);

//export Excel detailListPurchaseOrder

// routes.route('/export-excel').get(performanceReportController.exportExcelPerformanceReport);

//Gen ID
routes.route('/count').get(purchaseOrdersController.countOrderStatus);

//get purchase-order-option
routes.route('/request-purchase-order').get(purchaseOrdersController.getListRequestPurchaseOrderOptions);

routes.route('/customer-options').get(purchaseOrdersController.getCustomerOptions);

routes.route('/order-options').get(purchaseOrdersController.getOrderOptions);

routes.route('/products-of-order').get(purchaseOrdersController.getProductsOfOrder);

module.exports = {
    prefix,
    routes,
};
