const express = require('express');
const validate = require('express-validation');
const controller = require('./regime-type.controller');
const routes = express.Router();
const rules = require('./regime-type.rule');
const prefix = '/regime-type';

routes
    .route('')
    .get(controller.getListRegimeType)
    .post(validate(rules.createRegimeType), controller.createRegimeType)
    .delete(controller.deleteRegimeType);

routes.route('/:regime_type_id(\\d+)').put(validate(rules.updateRegimeType), controller.updateRegimeType);

routes.route('/:regime_type_id(\\d+)').get(controller.detailRegimeType);

routes.route('/get-user-options').get(controller.getUserOptions);

routes.route('/get-department-options').get(controller.getDepartmentOptions);

routes
    .route('/review-level')
    .get(controller.getReviewLevelList)
    .post(validate(rules.createReviewLevel), controller.createReviewLevel)
    .delete(controller.deleteReviewLevel);

routes.route('/get-position-options').get(controller.getPositionOptions);

module.exports = {
    prefix,
    routes,
};
