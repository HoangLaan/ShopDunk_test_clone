const express = require('express');
const validate = require('express-validation');
const rules = require('./payment-slip.rule');
const paymentSlipController = require('./payment-slip.controller');
const routes = express.Router();
const prefix = '/payment-slip';
const multer = require('multer');
const path = require('path');

const uploadCDN = multer({
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, false);
        // Allowed ext
        const filetypes = /doc|docx|pdf|xlsx|xls|jpg|png/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
});

// create
routes.route('').post(paymentSlipController.createPaymentSlip);
// update
routes.route('').put(paymentSlipController.updatePaymentSlip);
// detail
routes.route('/:payment_slip_id(\\d+)').get(paymentSlipController.detailPaymentSlip);

// List option
routes.route('/expend-type').get(paymentSlipController.getOptionsExpendType);
routes.route('/payer').get(paymentSlipController.getOptionsPayer);

// Approve
routes.route('/:paymentSlipId(\\d+)/approved-review-list').put(paymentSlipController.approvedReviewList);

// Export PdexportPDF
routes.route('/export-pdf').get(paymentSlipController.exportPDF);

// Get code
routes.route('/gen-code').get(paymentSlipController.genPaymentSlipCode);

// Upload file
routes.route('/upload').post(uploadCDN.any(), paymentSlipController.upload);

// Delete file
routes.route('/file/:file_id(\\d+)/module/:file_module_id(\\d+)').delete(paymentSlipController.deleteFile);

// Lay danh sach người nhận (nhà cung cấp, khách hàng và nhân viên) //getOptionsDeliveryCode
routes.route('/receiver/get-options').get(paymentSlipController.getReceiverOptions);

//list review level
routes.route('/get-review-level').get(paymentSlipController.getReviewLevelByExpendType);

// Download  file
routes.route('/download-file/:file_id(\\d+)').post(paymentSlipController.downloadFile);

routes.route('/review-list-by-type/:expendTypeId(\\d+)').get(paymentSlipController.getListReviewByExpendType);

routes.route('/invoice-options').get(paymentSlipController.getInvoiceOptions);

module.exports = {
    prefix,
    routes,
};
