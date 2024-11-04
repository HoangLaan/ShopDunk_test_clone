const express = require('express');
const validate = require('express-validation');
const offWorkController = require('./offwork.controller');
const routes = express.Router();
const rules = require('./offwork.rule');
const prefix = '/off-work';

// Get list, Create
routes
    .route('')
    .get(offWorkController.getListOffWork)
    .post(validate(rules.createOffWork), offWorkController.createOffWork);

// Detail, edit, delete
routes
    .route('/:offWorkId(\\d+)')
    .get(offWorkController.detailOffWork)
    .put(validate(rules.updateOffWork), offWorkController.updateOffWork)
    .delete(offWorkController.deleteOffWork);

// Approve
routes.route('/:offWorkId(\\d+)/approved-review-list').put(offWorkController.approvedOffWorkReviewList);

// Get total day offwork
routes.route('/me/total-day-offwork').get(offWorkController.getTotalDayOffWork);

// Get user in department offwork
routes.route('/user-of-deparment-options').get(offWorkController.getUserOfDepartmentOpts);

// Get user schedule by username and date
routes.route('/user-schedule-option').get(offWorkController.getUserScheduleOtps);

routes.route('/confirm').put(offWorkController.updateConfirm);

routes.route('/export').get(offWorkController.exportListOffWork);

module.exports = {
    prefix,
    routes,
};
