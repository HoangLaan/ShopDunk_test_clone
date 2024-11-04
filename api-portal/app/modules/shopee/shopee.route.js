

const express = require('express');
const validate = require('express-validation');
const shopeeController = require('./shopee.controller');
const routes = express.Router();
const rules = require('./shopee.rule');
const prefix = '/shopee';


routes.route('/').post(shopeeController.connectShoppe);

routes.route('/disconnect').post(shopeeController.DisconnectShopee);

routes.route('/get-profile').post(shopeeController.getProfileShop);

routes.route('/get-list-product').post(shopeeController.getProduct);

routes.route('/remove-token').post(shopeeController.removeToken);

routes.route('/check-token').get(shopeeController.checkToken);

routes.route('/update-stock').post(shopeeController.updateStockShopee);

routes.route('/get-list-order').post(shopeeController.getListOrder);

routes.route('/refesh-token').post(shopeeController.refeshToken);

routes.route('/crawl-order').post(shopeeController.crawlListOrderInsert)

routes.route('/get-access-token').post(shopeeController.getAccessToken)

routes.route('/get-sign').post(shopeeController.getSignShopee)

routes.route('/authorization').get(shopeeController.getAuthor)

routes.route('/option-shipping').post(shopeeController.getOptionShippingList)

routes.route('/ship-order').post(shopeeController.shipOrder)

routes.route('/get-tracking-number-code').post(shopeeController.getTrackingNumberCode);

// Day la duong dan tai file
routes.route('/print-shipping').post(shopeeController.shippingDocument);

routes.route('/cancel-order').post(shopeeController.cancelOrder);

routes.route('/push-shopee').post(shopeeController.getPushShopee);

routes.route('/option-stock').get(shopeeController.getOptsStocks);

routes.route('/update-stock_id').post(shopeeController.updateStocks);

routes.route('/update-product-shopee').post(shopeeController.updateProductIDShopee);

routes.route('/option-product').get(shopeeController.getProductOptions);

routes.route('/delete-product-shopee-id').post(shopeeController.deleteIDShopee);

routes.route('/get-mode-list').post(shopeeController.getModelList);




module.exports = {
    prefix,
    routes,

};
