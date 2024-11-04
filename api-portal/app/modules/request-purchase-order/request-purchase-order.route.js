const express = require('express');
const validate = require('express-validation');
const requestPurchaseOrderController = require('./request-purchase-order.controller');
const routes = express.Router();
const rules = require('./request-purchase-order.rule');
const prefix = '/request-purchase-order';

routes.route('/generate-code').get(requestPurchaseOrderController.generateCode);

routes.route('/request-purchase-code/:requestPurchaseCode').get(requestPurchaseOrderController.detailByCode);

routes
    .route('')
    .get(requestPurchaseOrderController.getList)
    .post(validate(rules.create), requestPurchaseOrderController.createOrUpdate);

routes.route('/delete').post(requestPurchaseOrderController.delete);

routes
    .route('/:requestPurchaseId(\\d+)')
    .get(requestPurchaseOrderController.detail)
    .put(validate(rules.update), requestPurchaseOrderController.createOrUpdate);

routes.route('/pr-product').post(requestPurchaseOrderController.getPRProduct);
routes.route('/purchase-requisition-search').post(requestPurchaseOrderController.searchPurchaseRequisition);

routes.route('/order-history').get(requestPurchaseOrderController.getOrderHistory);

routes.route('/:requestPurchaseId(\\d+)/print').post(requestPurchaseOrderController.print);

routes.route('/count').get(requestPurchaseOrderController.countIsOrdered);

routes.route('/multi-po').post(requestPurchaseOrderController.detailByMultiPO);

routes.route('/user-review').get(requestPurchaseOrderController.getUserByDepartmentId);

routes.route('/update-review').post(requestPurchaseOrderController.updateReview);

routes.route('/store-options').post(requestPurchaseOrderController.getStoreOptionsByPurchaseRequisitionIds);

routes.route('/price-nearly').get(requestPurchaseOrderController.getPriceNearly);

routes.route('/purchase-samsung').post(requestPurchaseOrderController.purchaseSamSung);

module.exports = {
    prefix,
    routes,
};
