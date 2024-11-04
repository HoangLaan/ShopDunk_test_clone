const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-out-request.rule');
const stocksOutRequestController = require('./stocks-out-request.controller');
const routes = express.Router();
const prefix = '/stocks-out-request';

// Option deboune
routes.route('/bussiness/options/').get();

// List
routes.route('').get(stocksOutRequestController.getList);
routes.route('/list-stocks-out-type').get(stocksOutRequestController.getListStocksOutType);
routes.route('/list-unit').get(stocksOutRequestController.getListUnit);
routes.route('/list-output-type').get(stocksOutRequestController.getListOutputType);
routes.route('/list-detail').get(stocksOutRequestController.getListDetail);
routes
    .route('/list-reivew/:stocks_out_type_id(\\d+)')
    .get(stocksOutRequestController.getListReviewLevelByStocksOutypeId);
//routes.route('/approve-or-reject)').post(stocksOutRequestController.approveOrRejectUpdateStocksout);
routes.route('/approve-reject').post(stocksOutRequestController.approveOrRejectUpdateStocksout);

routes
    .route('/get-options-stocks') //option stocks
    .get(stocksOutRequestController.getOptsStocks);
routes.route('/max-id').get(stocksOutRequestController.getMaxId);

routes.route('/export-pdf-by-order/:order_id(\\d+)').get(stocksOutRequestController.exportPDFByOrder);

// Detail
routes.route('/:stocks_out_request_id(\\d+)').get(stocksOutRequestController.detailStocksOutRequest);

// Create
routes.route('').post(validate(rules.createStocksOutRequest), stocksOutRequestController.createStocksOutRequest);

routes
    .route('/detail')
    .post(validate(rules.createStocksOutRequest), stocksOutRequestController.createStocksOutRequestDetail);

// Update
routes
    .route('/:stocks_out_request_id(\\d+)')
    .put(validate(rules.updateStocksOutRequest), stocksOutRequestController.updateStocksOutRequest);

// Delete
routes.route('/:stocks_out_request_id(\\d+)').delete(stocksOutRequestController.deleteStocksOutRequest);
// Delete

// Gen data
routes
    .route('/gen-data/:stocks_out_type_id(\\d+)') //gen stocks out type
    .get(stocksOutRequestController.genDataByStocksOutTypeId);
routes
    .route('/gen-data-stocks-manager/:stocks_id(\\d+)') // gen stocks manager
    .get(stocksOutRequestController.getStocksManager);
routes.route('/list-customer').get(stocksOutRequestController.getListCustomer);

routes
    .route('/gen-stocks-request-code/:stocks_out_type_id') // gen code
    .get(stocksOutRequestController.stocksOutRequestGenCode);

routes
    .route('/get-options-product-code') // List options getOptsProductCode
    .get(stocksOutRequestController.getOptsProductCode);

routes
    .route('/get-unit/:product_id(\\d+)') // Get unitList
    .get(stocksOutRequestController.getUnitList);

routes
    .route('/product/total-inventory') // get list description
    .get(stocksOutRequestController.getTotalInventoryImei);

// Export exportPDF
routes.route('/export-pdf/:stocks_out_request_id').get(stocksOutRequestController.exportPDF);

routes.route('/export-transport-pdf/:stocks_out_request_id').get(stocksOutRequestController.exportTransportPDF);

routes.route('/detail-to-print').get(stocksOutRequestController.detailToPrint);

// Get production options
routes.route('/product/get-options').get(stocksOutRequestController.getProductOptions);

// Lấy thông tin từ kho xuất ( nhân viên và sản phẩm )
routes.route('/stocks/:stocks_id(\\d+)/data').get(stocksOutRequestController.getStocksData);

// Xuat file excel
routes.route('/export-excel').get(stocksOutRequestController.exportExcel);

// get list deboune customer
routes.route('/list-customer/deboune').get(stocksOutRequestController.getListCustomerDeboune);
routes.route('/list-created-user/deboune').get(stocksOutRequestController.getListCreatedUserDebune);

// export
routes.route('/stocks-outputed').post(stocksOutRequestController.stocksOutputed);

// Delete a area
routes.route('/').delete(stocksOutRequestController.deleteListStocksOut);

// Get production options
routes.route('/orders/get-options').get(stocksOutRequestController.getOptionsOrders);

// create stocks out request by order id
routes.route('/create-by-order/:order_id(\\d+)').post(stocksOutRequestController.createStocksoutRequestByOrderID);

routes
    .route('/product-by-imei') // get list description
    .get(stocksOutRequestController.getProductByImei);

routes
    .route('/by-order/:order_id(\\d+)') // get stocks out request by order
    .get(stocksOutRequestController.getStocksOutRequestByOrder);

module.exports = {
    prefix,
    routes,
};
