const express = require('express');
const controller = require('./product.controller');
const routes = express.Router();
//const rules = require('./product.rule');
const prefix = '/product';

//Get product by imei
routes.route('/get-product-by-imei').get(controller.getProductByIMEI);

// get list of products
routes.route('/').get(controller.getListProduct);

// get attributes of product model
routes.route('/attributes').get(controller.getAttributesProduct);

//get product by MODELID
routes.route('/model/:model_id(\\d+)').get(controller.getProductByModelId);

// get promotion of product
routes.route('/promotion').post(controller.getPromotionProduct);

// get information about products
routes.route('/detail/:product_id/stock/:stocks_id').get(controller.getInformationProduct);

routes.route('/pre-order/get-models').get(controller.getPreOrderModels);

routes.route('/pre-order/get-money-deposit').get(controller.getPreOrderMoneyDeposit);

module.exports = {
    prefix,
    routes,
};
