const express = require('express');
const validate = require('express-validation');
const controller = require('./receive-payment-slip.controller');
const routes = express.Router();
const prefix = '/receive-payment-slip';

// Get list, create, update, delete
routes.route('').get(controller.getList).delete(controller.deleteList);

routes.route('/statistics').get(controller.statistics);
routes.route('/bookkeeping').put(controller.bookkeeping);
routes.route('/un-bookkeeping').put(controller.unBookkeeping);

routes.route('/dept-account-opts').get(controller.getDeptAccountingAccountOpts);
routes.route('/credit-account-opts').get(controller.getCreditAccountingAccountOpts);
routes.route('/receive-slip-type-opts').get(controller.getReceiveTypeOpts);
routes.route('/payment-slip-type-opts').get(controller.getPaymentSlipTypeOpts);
routes.route('/business-by-user-opts').get(controller.getBusinessOptionsByUser);
routes.route('/store-by-user-opts').get(controller.getStoreOptionsByUser);

// Export excel
routes.route('/export-excel').get(controller.exportExcel);

// Download template
routes.route('/download-excel').get(controller.downloadExcel);

// Import excel
routes.route('/import-excel').post(controller.importExcel);

// Export PdexportPDF
routes.route('/export-pdf').get(controller.exportPDF);

//Update review
routes.route('/update-review').put(controller.updateReview);

module.exports = {
    prefix,
    routes,
};
