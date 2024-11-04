const express = require('express');
const validate = require('express-validation');
const purchaseCostController = require('./purchase-cost.controller');
const routes = express.Router();
const rules = require('./purchase-cost.rule');
const prefix = '/purchase-cost';

// List
routes.route('').get(purchaseCostController.getListPurchaseCost)
                .post(validate(rules.create), purchaseCostController.createPurchaseCost)
                .put(validate(rules.update), purchaseCostController.updatePurchaseCost)
                .delete(validate(rules.delete), purchaseCostController.deletePurchaseCost);
// //detail
routes.route('/:purchase_cost_id(\\d+)').get(purchaseCostController.detailPurchaseCost);

// //Gen ID
routes.route('/get-id').get(purchaseCostController.getPurchaseCostId);

module.exports = {
    prefix,
    routes,
};
