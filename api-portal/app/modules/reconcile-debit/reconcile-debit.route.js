const express = require('express');
const validate = require('express-validation');
const controller = require('./reconcile-debit.controller');
const routes = express.Router();
const rules = require('./reconcile-debit.rule');
const prefix = '/reconcile-debit';

routes.route('/load-data').get(controller.loadData);

routes.route('/history').get(controller.getListHistory);

routes.route('/execute').post(controller.executeReconcile);

routes.route('/revert').post(controller.revertReconcile);

module.exports = {
    prefix,
    routes,
};
