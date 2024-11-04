const express = require('express');
const validate = require('express-validation');
const controller = require('./expend-type.controller');
const routes = express.Router();
const rules = require('./expend-type.rule');
const prefix = '/expend-type';

routes
    .route('')
    .get(controller.getListExpendType)
    .post(validate(rules.createExpendType), controller.createExpendType)
    .delete(controller.deleteExpendType);

routes.route('/:expend_type_id(\\d+)').put(validate(rules.updateExpendType), controller.updateExpendType);

// Detail a area
routes.route('/:expend_type_id(\\d+)').get(controller.detailExpendType);

routes.route('/get-options').get(controller.getExpendTypeOptions);

routes.route('/get-company-options').get(controller.getCompanyOptions);

routes.route('/get-business-options').get(controller.getBusinessOptions);

routes.route('/get-user-options').get(controller.getUserOptions);

routes.route('/get-department-options').get(controller.getDepartmentOptions);

routes
    .route('/review-level')
    .get(controller.getReviewLevelList)
    .post(validate(rules.createReviewLevel), controller.createReviewLevel)
    .delete(controller.deleteReviewLevel);

routes.route('/get-position-options').get(controller.getPositionOptions);

routes.route('/bank-account').get(controller.getListBankAccount);

module.exports = {
    prefix,
    routes,
};
