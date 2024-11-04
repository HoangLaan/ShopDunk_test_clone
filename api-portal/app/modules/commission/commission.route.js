const express = require('express');
const validate = require('express-validation');
const commissionController = require('./commission.controller');
const routes = express.Router();
const rules = require('./commission.rule');
const prefix = '/commission';

// Commission
routes.route('').get(commissionController.getListCommission);
routes.route('').post(validate(rules.createCommission), commissionController.createCommission);
routes.route('/:commissionId(\\d+)').get(commissionController.detailCommission);
routes.route('/:commissionId(\\d+)').put(validate(rules.updateCommission), commissionController.updateCommission);
routes.route('/:commissionId(\\d+)/stop').put(validate(rules.stopCommission), commissionController.stopCommission);
routes.route('/:commissionId(\\d+)').delete(commissionController.deleteCommission);
routes.route('/delete').post(commissionController.delCommissionIds);

// Get company commission options
routes.route('/company/get-options').get(commissionController.getCommissionCompanyOptions);

// Get department position
routes.route('/department-position').get(commissionController.getDepartmentPosition);
routes.route('/department-position-v2').get(commissionController.getDepartmentPositionV2);

// Get user department options
routes.route('/user-department-options').get(commissionController.getUserDepartmentOptions);

// Get order type options
routes.route('/order-type-options').get(commissionController.getOrderTypeOptions);

// appcept review commisson
routes.route('/review').put(commissionController.changeStatusReview);

module.exports = {
    prefix,
    routes,
};
