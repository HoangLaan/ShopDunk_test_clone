const express = require('express');
const validate = require('express-validation');
const controller = require('./purchase-requisition.controller');
const routes = express.Router();
const rules = require('./purchase-requisition.rule');
const prefix = '/purchase-requisition';
const multer = require('multer');

routes
    .route('')
    .get(controller.getList)
    .post(multer().single('document_url'), rules.createOrUpdate, controller.createPurchaseRequisition)
    .put(multer().single('document_url'), rules.createOrUpdate, controller.updatePurchaseRequisition)
    .delete(controller.deletePurchaseRequisition);

routes.route('/review').post(validate(rules.updateReview), controller.updateReview);

// Detail a area
routes.route('/:purchase_requisition_id(\\d+)').get(controller.getById);

// exportPDF
routes.route('/export-pdf/:purchase_requisition_id(\\d+)').get(controller.exportPDF);

// List options purchase requisition
routes.route('/get-options').get(controller.getOptions);

// Review
routes.route('/get-user-options').get(controller.getUserOptions);
routes
    .route('/review-level')
    .get(controller.getReviewLevelList)
    .post(validate(rules.createReviewLevel), controller.createReviewLevel)
    .delete(controller.deleteReviewLevel);

routes.route('/get-detail-review').get(controller.getReviewInformation);
routes.route('/count').get(controller.countPrStatus);

module.exports = {
    prefix,
    routes,
};
