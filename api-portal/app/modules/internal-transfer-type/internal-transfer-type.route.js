const express = require('express');
const validate = require('express-validation');
const rules = require('./internal-transfer-type.rule');
const internalTransferTypeController = require('./internal-transfer-type.controller');
const routes = express.Router();
const prefix = '/internal-transfer-type';

routes
  .route('')
  .get(internalTransferTypeController.getList)
  .post(validate(rules.create), internalTransferTypeController.createOrUpdate)
  .put(validate(rules.update), internalTransferTypeController.createOrUpdate)
  .delete(internalTransferTypeController.delete);

routes
    .route('/review-level')
    .get(internalTransferTypeController.getReviewLevelList)
    .post(validate(rules.createReviewLevel), internalTransferTypeController.createReviewLevel)
    .delete(internalTransferTypeController.deleteReviewLevel);
routes.route('/get-user-options').get(internalTransferTypeController.getUserOptions);

routes.route('/:id').get(internalTransferTypeController.getById);

module.exports = {
  prefix,
  routes,
};
