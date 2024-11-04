const express = require('express');
const debitController = require('./debit.controller');
const routes = express.Router();
const prefix = '/debit';

routes.route('').get(debitController.getListDebit);

routes.route('').delete(debitController.deleteDebit);

routes.route('/pay').get(debitController.getListPayDebit);

routes.route('/pay/:debit_id').get(debitController.getById);

routes.route('/export-excel').post(debitController.exportExcel);

module.exports = {
    prefix,
    routes,
};
