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

// Update review
routes.route('/update-review').post(validate(rules.updateReview), controller.updateReview);

//get Review
routes.route('/get-detail-review').get(controller.getReviewInformation);

//get list review by transfer shift type
routes.route('/list-review').get(controller.getListReview);

//get list review by user
routes.route('/list-review-by-user').get(controller.getListReviewByUser);

//get shift
routes.route('/get-shift').get(controller.getShift);

//get business
routes.route('/get-business').get(controller.getBusiness);

//get store
routes.route('/get-store').get(controller.getStore);

//get transfer shift type
routes.route('/get-transfer-shift-type').get(controller.getListTransferShiftType);

// Detail
routes.route('/:id').get(controller.detail);

// Update
routes.route('/:id').put(validate(rules.update), controller.update);

module.exports = {
    prefix,
    routes,
};
