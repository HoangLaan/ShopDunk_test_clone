const express = require('express');
const validate = require('express-validation');
const rules = require('./purchase-requisition-type.rule');
const purchaseRequisitionTypeController = require('./purchase-requisition-type.controller');
const routes = express.Router();
const prefix = '/purchase-requisition-type';

routes
  .route('')
  .get(purchaseRequisitionTypeController.getList)
  .post(validate(rules.create), purchaseRequisitionTypeController.createOrUpdate)
  .put(validate(rules.update), purchaseRequisitionTypeController.createOrUpdate)
  .delete(purchaseRequisitionTypeController.delete);

routes.route('/:id(\\d+)').get(purchaseRequisitionTypeController.getById);

routes
    .route('/review-level')
    .get(purchaseRequisitionTypeController.getReviewLevelList)
    .post(validate(rules.createReviewLevel), purchaseRequisitionTypeController.createReviewLevel)
    .delete(purchaseRequisitionTypeController.deleteReviewLevel);

module.exports = {
  prefix,
  routes,
};
