const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-in-request.rule');
const stocksInRequestController = require('./stocks-in-request.controller');
const routes = express.Router();
const prefix = '/stocks-in-request';

// List stocksInRequest
routes.route('').get(stocksInRequestController.getListStocksInRequest);

// Create new a stocksInRequest
routes.route('').post(validate(rules.createStocksInRequest), stocksInRequestController.createStocksInRequest);

// Update a stocksInRequest
routes
    .route('/:stocksInRequestId(\\d+)')
    .put(validate(rules.updateStocksInRequest), stocksInRequestController.updateStocksInRequest);

// Delete a stocksInRequest
routes.route('').delete(stocksInRequestController.deleteStocksInRequest);

// Detail a stocksInRequest
routes.route('/:stocksInRequestId(\\d+)').get(stocksInRequestController.detailStocksInRequest);

// List options getOptsStocksStatus
routes.route('/get-options-status').get(stocksInRequestController.getOptsStocksStatus);

// List options getOptsStocksStatus
routes.route('/get-options-stocks').get(stocksInRequestController.getOptsStocks);

// Gen data
routes.route('/gen-data/:stocks_in_type_id(\\d+)').get(stocksInRequestController.genDataByStocksInTypeId);

// Gen manager
routes.route('/gen-data-stocks-manager/:stocks_id(\\d+)').get(stocksInRequestController.getStocksManager);

// Get VehicleList
routes.route('/get-vehicle/:partner_transport_id(\\d+)').get(stocksInRequestController.getVehicleList);

// getPhoneNumber
routes.route('/gen-phone-number/:driver_id(\\d+)').get(stocksInRequestController.getPhoneNumber);

// Gen data
routes.route('/gen-stocks-code').get(stocksInRequestController.genStocksInCodeStocks);

// List options getOptsProductCode
routes.route('/get-options-product-code').get(stocksInRequestController.getOptsProductCode);

// Gen ProductName
routes.route('/gen-product-name/:product_id(\\d+)').get(stocksInRequestController.genProductName);

// Get unitList
routes.route('/get-unit/:product_id(\\d+)').get(stocksInRequestController.getUnitList);

// Gen cost value
routes.route('/gen-cost-value/:cost_id(\\d+)').get(stocksInRequestController.genCostValue);

// get list description
routes.route('/get-list-description').get(stocksInRequestController.getListDescription);

// Export PdexportPDF
routes.route('/export-pdf').get(stocksInRequestController.exportPDF);

// Export PdexportPDF
routes.route('/detail-to-print').get(stocksInRequestController.detailToPrint);

// Gen lot number
routes.route('/gen-lot-number').get(stocksInRequestController.genLotNumber);

// get discount Supplier, Manufacture
routes.route('/get-discount').get(stocksInRequestController.getDiscount);

// Download template excel
routes.route('/download-excel').post(stocksInRequestController.downloadExcel);

// get output status
routes.route('/get-output-status').get(stocksInRequestController.getOutputStatus);

// get list unit price
routes.route('/get-unit-price-list').get(stocksInRequestController.getUnitPriceList);

// get list unit price
routes.route('/change-unit-price-list').get(stocksInRequestController.changeUnitPrice);

// List options product type
routes.route('/product-type/get-options').get(stocksInRequestController.getOptsProductType);

// Upload excel
routes.route('/upload').post(stocksInRequestController.uploadExcel);

// Get total product imei in day
routes.route('/init').get(stocksInRequestController.getInit);

/// NEW STOCKSIN REQUEST HERE
routes.route('/product-options').get(stocksInRequestController.getProductOptions);

routes.route('/product/:product_id(\\d+)').get(stocksInRequestController.getProductInit);

routes.route('/stocks-in-type/get-options').get(stocksInRequestController.getStocksInTypeOptions);

// Lay thong tin cua loai kho
routes.route('/stocks-in-type/:stocks_in_type_id(\\d+)').get(stocksInRequestController.getDetailStocksInType);

// Xuat file excel
routes.route('/export-excel').get(stocksInRequestController.exportExcel);

// List options getOptsuser request
routes.route('/get-user-request').get(stocksInRequestController.getOptionsUserRequest);
// List options level review
routes.route('/get-review-level').get(stocksInRequestController.getOptionsStocksReviewLevel);
// review stocks in request
routes.route('/approved-review').put(stocksInRequestController.approvedReview);

// Update imei
routes.route('/update-imei').post(stocksInRequestController.updateImei);

// List options getOptsCustomer import
routes.route('/get-customer-list').get(stocksInRequestController.getOptionsCustomer);

// Create new stocks detail
routes.route('/create-stocks-detail').post(stocksInRequestController.createStocksDetail);

// Get total product imei in day
routes.route('/get-info-product-imei-code').get(stocksInRequestController.getInfoOfProductImeiCode);

// check product imei
routes.route('/check-imei-code').get(stocksInRequestController.checkImeiCode);

// Detail a supplier stocks in request
routes.route('/supplier/:supplier_id(\\d+)').get(stocksInRequestController.detailSupplierImportProductInStock);

// get list options purchase if stocks in request have
routes.route('/get-option-purchase').get(stocksInRequestController.getOptionsPurchase);

// get list products option purchase by products imei
routes.route('/product-purchase').get(stocksInRequestController.getOptionProductStRequestByPurchase);

// get list purchase order
routes.route('/get-option-purchase-import').get(stocksInRequestController.getOptionsPurchaseWhenImportStock);

routes.route('/get-store-options').get(stocksInRequestController.getStoreOptions);

routes.route('/gen-lot-number').get(stocksInRequestController.genLotNumber);

routes.route('/customer-options').get(stocksInRequestController.getCustomerOptions);

module.exports = {
    prefix,
    routes,
};
