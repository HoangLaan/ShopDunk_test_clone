const express = require('express');
const OffWorkTypeController = require('./offwork-type.controller');
const routes = express.Router();
const prefix = '/off-work-type';

// List
routes.route('').get(OffWorkTypeController.getListOffWorkType);

// Detail
routes.route('/:offWorkTypeId(\\d+)').get(OffWorkTypeController.detailOffWorkType);

// Create
routes.route('').post(OffWorkTypeController.createOffWorkType);

// Edit
routes.route('/:offWorkTypeId(\\d+)').put(OffWorkTypeController.updateOffWorkType);

// Delete
routes.route('').delete(OffWorkTypeController.deleteOffWorkType);

// Get options offwork type
routes.route('/get-list-offwork-rl-user').get(OffWorkTypeController.getListOffWorkRlUser);

// get Options for create
routes.route('/get-options-for-create').get(OffWorkTypeController.getOptionsForCreate);

// get Options for user
routes.route('/get-options-for-user').get(OffWorkTypeController.getOptionsForUser);

module.exports = {
    prefix,
    routes,
};
