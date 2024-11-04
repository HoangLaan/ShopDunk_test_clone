const express = require('express');
const validate = require('express-validation');
const rules = require('./work-schedule-type.rule');
const workScheduleTypeController = require('./work-schedule-type.controller');

const routes = express.Router();

const prefix = '/work-schedule-type';

// List Task Work Flow
routes.route('').get(workScheduleTypeController.getListWorkScheduleType);

// Create new a Task Work Flow
routes.route('').post(validate(rules.create), workScheduleTypeController.createWorkScheduleType);

// Update a Task Work Flow
routes.route('/:id(\\d+)').put(validate(rules.update), workScheduleTypeController.updateWorkScheduleType);

// Delete a Task Work Flow
routes.route('').delete(workScheduleTypeController.deleteWorkScheduleType);

// Detail a Task Work Flow
routes.route('/:id(\\d+)').get(workScheduleTypeController.detailWorkScheduleType);

routes.route('/company-options').get(workScheduleTypeController.getCompanyOptions);

routes.route('/department-options').get(workScheduleTypeController.getDepartmentOptions);

routes.route('/position-options').get(workScheduleTypeController.getPositionOptions);

routes.route('/review-level').post(workScheduleTypeController.createReviewLevel);

routes.route('/review-level').get(workScheduleTypeController.getListReviewLevel);

routes.route('/user-options').get(workScheduleTypeController.getUserOptions);

module.exports = {
    prefix,
    routes,
};
