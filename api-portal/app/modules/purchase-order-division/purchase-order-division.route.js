const express = require('express');
const validate = require('express-validation');
const rules = require('./purchase-order-division.rule');
const purchaseOrderDivisionController = require('./purchase-order-division.controller');
const routes = express.Router();
const prefix = '/purchase-order-division';

routes
    .route('')
    .get(purchaseOrderDivisionController.getList)
    .post(validate(rules.create), purchaseOrderDivisionController.createOrUpdate)
    .put(validate(rules.update), purchaseOrderDivisionController.createOrUpdate)
    .delete(purchaseOrderDivisionController.delete);

routes.route('/multi-store')
.post(validate(rules.create), purchaseOrderDivisionController.createOrUpdateWithMultiStore)
.put(validate(rules.update), purchaseOrderDivisionController.createOrUpdateWithMultiStore);

// review level
routes
    .route('/review-level')
    .get(purchaseOrderDivisionController.getReviewLevelList)
    .post(validate(rules.createReviewLevel), purchaseOrderDivisionController.createReviewLevel)
    .delete(purchaseOrderDivisionController.deleteReviewLevel);

routes.route('/list-stock').post(purchaseOrderDivisionController.getListStockOptions)

routes.route('/:id(\\d+)').get(purchaseOrderDivisionController.getById)

routes.route('/genCodeDivision').post(purchaseOrderDivisionController.genCode)

routes.route('/stock-of-business').get(purchaseOrderDivisionController.getStockOfBusiness)

routes.route('/inventory-product').post(purchaseOrderDivisionController.getInventoryByProduct)

routes.route('/business-options').get(purchaseOrderDivisionController.getBusinessByStore)

routes.route('/pro-stocks-inventory').post(purchaseOrderDivisionController.getProStocksInventory)

routes.route('/history-order').post(purchaseOrderDivisionController.getHistoryOrderList)

module.exports = {
    prefix,
    routes,
};
