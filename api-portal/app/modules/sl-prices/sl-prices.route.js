const express = require('express');
const validate = require('express-validation');
const rules = require('./sl-prices.rule');
const slPricesController = require('./sl-prices.controller');
const multer = require('multer');
const path = require('path');
const routes = express.Router();
const prefix = '/sl-prices';

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


// List slPrice
routes.route('').get(slPricesController.getListPrice).post(validate(rules.createPrice), slPricesController.createPrice);

// List slPrice
routes.route('/list-output-type').get(slPricesController.getListOutputType);

routes.route('/list-area-by-output-type').get(slPricesController.listAreaByOutputType);

routes.route('/list-business-by-area').get(slPricesController.listBussinessByArea);

// Update a slPrice
routes.route('/:priceId(\\d+)').put(validate(rules.updatePrice), slPricesController.updatePrice);

// Delete a slPrice
routes.route('/:priceId(\\d+)').delete(slPricesController.deletePrice);

// Detail a slPrice
routes.route('/:productId(\\d+)').get(slPricesController.detailPrice);

// Detail a slPrice by product
routes.route('/option/product/:productId(\\d+)').get(slPricesController.detailPriceProduct);

// Detail a slPrice by optional
routes.route('/option/:productId(\\d+)').get(slPricesController.detailPriceByOption);

// Change status a slPrice
routes
    .route('/:priceId(\\d+)/change-status')
    .put(validate(rules.changeStatusPrice), slPricesController.changeStatusPrice);

routes
    .route('/:priceId(\\d+)/approved-review-list')
    .put(validate(rules.approvedPriceReviewList), slPricesController.approvedPriceReviewList);

// Export excel
routes.route('/export-excel').get(slPricesController.exportExcel);

// Export excel Price List
routes.route('/export-excel-price-list').get(slPricesController.exportExcelPriceList);

// List options Price List
routes.route('/get-options-output-type').get(slPricesController.getOptionsOutPutType);

// List options Price List
routes.route('/get-options-review_level').get(slPricesController.getOptionsReviewLevel);

// List options Price List
routes.route('/get-options-review_level_user').get(slPricesController.getOptionsReviewLevelUser);

// Detail a slPrice
routes.route('/:outputtypeId(\\d+)/value-area-out-put-type').get(slPricesController.valueAreaOutPutType);

routes.route('/:priceId(\\d+)/review').put(slPricesController.reviewPrice);

// Create a change price multi Products
routes
    .route('/prices-list')
    .get(slPricesController.getListProductAndComponent)
    .post(validate(rules.changePriceMultiProduct), slPricesController.changePriceMultiProduct);

// getListPriceProductHistory
routes.route('/prices-list/history').get(slPricesController.getListPriceProductHistory);

// review list price
routes.route('/list-product/review').put(slPricesController.reviewListPrice);

// detail product
routes.route('/product/:productId(\\d+)').get(slPricesController.detailProduct);

// detail model
routes.route('/model/attribute').get(slPricesController.detailModelAttribute);

// Download template
routes.route('/download-excel').get(slPricesController.downloadExcel);

// Import excel
routes.route('/import-excel').post(upload.single('priceimport'), slPricesController.importExcel);

module.exports = {
    prefix,
    routes,
};
