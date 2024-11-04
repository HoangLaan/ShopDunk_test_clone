const express = require('express');
const validate = require('express-validation');
const stocksTransfer = require('./stocks-transfer.controller');
const routes = express.Router();
const rules = require('./stocks-transfer.rule');
const prefix = '/stocks-transfer';
const multer = require('multer');
const path = require('path');
const appRootPath = require('app-root-path');
const mkdirp = require('mkdirp-promise');
const fs = require('fs');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/excel-file`);

let storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        if (!fs.existsSync(pathMediaUpload)) {
            await mkdirp(pathMediaUpload);
        }

        cb(null, pathMediaUpload);
    },
    filename: function (req, file, cb) {
        cb(null, 'product-transfer-' + Date.now() + '.xlsx');
    },
});

const upload = multer({ storage: storage });

// Lấy danh sách kho tổng
routes.route('/get-general-stocks').get(stocksTransfer.getGeneralStocks);

// List stocks_transfer
routes
    .route('')
    .get(stocksTransfer.getListStocksTransfer)
    .post(validate(rules.createStocksTransfer), stocksTransfer.createStocksTransfer);

// Update stocks_transfer
routes
    .route('/:stocks_transfer_id(\\d+)')
    .put(validate(rules.updateStocksTransfer), stocksTransfer.updateStocksTransfer);

// List user_create stocks_transfer
routes.route('/user-options').get(stocksTransfer.getUserOpts);

// List user_create stocks_transfer
routes.route('/sys-user-options').get(stocksTransfer.getSysUserOpts);

// Detail a stocks transfer
routes.route('/:stocks_transfer_id(\\d+)').get(stocksTransfer.detailStocksTransfer);

// Delete stocks_transfer
routes.route('/:stocks_transfer_id(\\d+)').delete(stocksTransfer.deleteStocksTransfer);

// Get stocks transfer code
routes.route('/gen-stocks-transfer-code').get(stocksTransfer.genStocksTransferCode);

// Lấy danh sách sản phẩm trong kho chuyển
routes.route('/get-product-transfer').get(stocksTransfer.getProductTransfer);

// Lấy danh sách duyệt theo loại hình thức chuyển kho
routes.route('/gen-review-level/:stocks_transfer_type_id(\\d+)').get(stocksTransfer.genReviewLevel);

// Duyệt phiếu xuất kho
routes.route('/review-stocks-transfer').put(stocksTransfer.reviewStocksTransferReview);
// Tải file mẫu excel
routes.route('/download-xcel-file').post(stocksTransfer.downloadExcel);

// upload file xcel
routes.route('/upload-file').post(upload.any(), stocksTransfer.uploadExcel);

// exportPDF
routes.route('/export-pdf/:stocks_transfer_id(\\d+)').get(stocksTransfer.exportPDF);

routes.route('/confirm-transfer/:stocks_transfer_id(\\d+)').put(stocksTransfer.confirmTranferProduct);

routes.route('/get-product-transfer-imei').get(stocksTransfer.getProductTransferByImei);

routes.route('/check-product-inventory').post(stocksTransfer.checkProductInventory);

routes.route('/get-stocks-tranfer-by-code').get(stocksTransfer.getStocksByCode);

routes.route('/get-info-stocks').get(stocksTransfer.getInfoStocks);

routes.route('/update-status-transfer').post(stocksTransfer.updateStatusTransfer);

module.exports = {
    prefix,
    routes,
};
