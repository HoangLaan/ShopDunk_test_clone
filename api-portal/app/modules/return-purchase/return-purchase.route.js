const express = require('express');
const validate = require('express-validation');
const rules = require('./return-purchase.rule');
const returnPurchaseController = require('./return-purchase.controller');
const routes = express.Router();
const prefix = '/return-purchase';

routes.route('/po-options').get(returnPurchaseController.getPurchaseOrdersOptions);

routes.route('/po-products').get(returnPurchaseController.getProductsOfPurchaseOrders);

routes.route('/stocks-options').get(returnPurchaseController.getStocksOptions);

routes.route('/po').get(returnPurchaseController.getPurchaseOrdersDetail);

routes.route('/invoice').post(returnPurchaseController.createInvoice);

routes.route('/invoice').get(returnPurchaseController.getOrderInvoice);

module.exports = {
    prefix,
    routes,
};
