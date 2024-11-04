const express = require('express');
const validate = require('express-validation');
const lazadaController = require('./lazada.controller');
const routes = express.Router();
const prefix = '/lazada';

routes.route('/profile').get(lazadaController.connectLazada);

routes.route('/get-profile').post(lazadaController.getProfileShop);

routes.route('/get-list-product').post(lazadaController.getProduct);

routes.route('/update-product-lazada').post(lazadaController.updateProductIDLazada);

routes.route('/option-stock').get(lazadaController.getOptsStocks);

routes.route('/option-product').get(lazadaController.getProductOptions);

routes.route('/delete-product-lazada-id').post(lazadaController.deleteIDLazada);

routes.route('/get-ware-house').post(lazadaController.getWareHouse);

routes.route('/update-stock').post(lazadaController.updateStockLazada);

routes.route('/get-list-order').post(lazadaController.getListOrder);

routes.route('/print-shipping').post(lazadaController.printShipping);

routes.route('/option-shipping').post(lazadaController.createPackOrder);

routes.route('/get-option-cancel').post(lazadaController.getOptionCancel)

routes.route('/cancel-order').post(lazadaController.cancelOrder);

routes.route('/update-sucess-failed').post(lazadaController.updateFailedOrSuccessOrder);

routes.route('/disconnect').post(lazadaController.DisconnectLazada);

routes.route('/').get(lazadaController.getconnectLazada);

routes.route('/update-stock_id').post(lazadaController.updateStocks);

routes.route('/push-lazada').post(lazadaController.getPushLazada);

routes.route('/update-single-stock').post(lazadaController.updateSingleStockLazada);

routes.route('/update-list-product-lazada').post(lazadaController.updateListProductLazada);

module.exports = {
    prefix,
    routes,
};
