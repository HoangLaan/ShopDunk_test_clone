const express = require('express');
const validate = require('express-validation');
const productController = require('./product.controller');
const routes = express.Router();
const rules = require('./product.rule');
const prefix = '/product';
const multer = require('multer');
const path = require('path');

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file) return cb(new Error('Vui lòng chọn file!'));
        // Allowed ext
        const filetypes = /xlsx|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('File không đúng định dạng!'));
        }
    },
});

// Get list product
routes
    .route('')
    .get(productController.getListProduct)
    .post(validate(rules.createProduct), productController.createProduct);

// Get options
routes.route('/unit/get-options').get(productController.getOptionsUnit);
routes.route('/origin/get-options').get(productController.getOptionsOrigin);
routes.route('/manufacture/get-options').get(productController.getOptionsManufacture);
routes.route('/store/get-options').get(productController.getOptionsStore);
routes.route('/stock-type/get-options').get(productController.getOptionsStockType);
routes.route('/stock/get-options').get(productController.getOptionsStock);
routes.route('/area/get-options').get(productController.getOptionsArea);
routes.route('/output-type/get-options').get(productController.getOptionsOutputType);
routes.route('/business/get-options').get(productController.getOptionsBusiness);
routes.route('/get-options').get(productController.getOptionsProduct);
routes.route('/stock-in-request/get-options').get(productController.getStockInRequest);

// Delete many product
routes.route('/delete').post(productController.deleteProduct);

// Get list attribute of model (product category)
routes
    .route('/attributes')
    .get(productController.getListAttributes)
    .post(validate(rules.createAttribute), productController.createAttribute);

// Get list product print barcode
// routes.route('/barcode').get(productController.getProductsPrintBarcode).post(productController.printBarcode);
routes.route('/barcode').get(productController.getProductsPrintBarcode).post(productController.printQROrBarcode);

// Export excel
routes.route('/export-excel').get(productController.exportExcel);

// Download template
routes.route('/download-excel').get(productController.downloadExcel);

// Import excel
routes.route('/import-excel').post(upload.single('productimport'), productController.importExcel);

// Detail and update
routes
    .route('/:product_id(\\d+)')
    .get(productController.detailProduct)
    .put(validate(rules.updateProduct), productController.updateProduct);

routes.route('/qr').post(productController.printQROrBarcode);
routes.route('/manufacturer-options').get(productController.getManufacturerOptions);

module.exports = {
    prefix,
    routes,
};
