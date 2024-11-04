const express = require('express');
const validate = require('express-validation');
const controller = require('./other-voucher.controller');
const routes = express.Router();
const rules = require('./other-voucher.rule');
const prefix = '/other-voucher';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

// Get detail
routes.route('/:other_acc_voucher_id(\\d+)').get(controller.detail);

// get code
routes.route('/gen-code').get(controller.genCode);

// get options
routes.route('/object-options').get(controller.getObjectOptions);

routes.route('/voucher-type-options').get(controller.getVoucherTypeOptions);

routes.route('/export-excel').post(controller.exportExcel);

routes.route('/export-pdf').get(controller.exportPDF);

routes.route('/store-option').get(controller.getStoreOptions);

module.exports = {
    prefix,
    routes,
};
