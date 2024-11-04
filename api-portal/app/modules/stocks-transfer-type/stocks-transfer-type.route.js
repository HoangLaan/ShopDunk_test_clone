const express = require('express');
const validate = require('express-validation');
const stocksTransferTypeController = require('./stocks-transfer-type.controller');
const routes = express.Router();
const rules = require('./stocks-transfer-type.rule');
const prefix = '/stocks-transfer-type';

routes
    .route('/')
    .get(stocksTransferTypeController.getListStocksTransferType)
    .post(validate(rules.createStocksTransferType), stocksTransferTypeController.createOrUpdateStocksTransferType)
    .delete(stocksTransferTypeController.delStocksTransferType);

routes.route('/:id(\\d+)/detail').get(stocksTransferTypeController.getSocksTransferTypeById);

routes.route('/get-options-review').get(stocksTransferTypeController.getOptionsReviewLevel);

routes.route('/get-options').get(stocksTransferTypeController.getOptions);

module.exports = {
    prefix,
    routes,
};
