const express = require('express');
const validate = require('express-validation');
const controller = require('./receive-debit.controller');
const routes = express.Router();
const rules = require('./receive-debit.rule');
const prefix = '/receive-debit';

// Get list, create, update, delete
routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.create)
    .put(validate(rules.update), controller.update)
    .delete(controller.deleteList);

routes.route('/detail').get(controller.getDetail);

routes.route('/export-excel').post(controller.exportExcel);

routes.route('/export-excel-detail').post(controller.exportExcelDetail);

module.exports = {
    prefix,
    routes,
};
