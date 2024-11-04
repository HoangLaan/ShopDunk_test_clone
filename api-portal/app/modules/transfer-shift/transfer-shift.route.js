const express = require('express');
const validate = require('express-validation');
const rules = require('./transfer-shift.rule');
const controller = require('./transfer-shift.controller');

const routes = express.Router();

const prefix = '/transfer-shift';

// List
routes.route('').get(controller.getList);

// Create new
routes.route('').post(validate(rules.create), controller.create);

// Create new
routes.route('/update-review').post(validate(rules.updateReview), controller.updateReview);

//get Review
routes.route('/get-detail-review').get(controller.getReviewInformation);

//get list review by transfer shift type
routes.route('/list-review').get(controller.getListReview);

//get shift
routes.route('/get-shift').get(controller.getShift);

//get transfer shift type
routes.route('/get-transfer-shift-type').get(controller.getListTransferShiftType);

// Detail
routes.route('/:id(\\d+)').get(controller.detail);

// Update
routes.route('/:id(\\d+)').put(validate(rules.update), controller.update);

// Delete
routes.route('').delete(controller.remove);

routes.route('/business-options').get(controller.getOptionBusiness);

module.exports = {
    prefix,
    routes,
};
