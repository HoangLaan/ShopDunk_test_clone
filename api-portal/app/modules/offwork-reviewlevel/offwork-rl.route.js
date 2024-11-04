const express = require('express');
const offWorkRLController = require('./offwork-rl.controller');
const routes = express.Router();
const prefix = '/off-work-reviewlevel';


// List 
routes.route('')
    .get(offWorkRLController.getListOffWorkRL);

// Detail
routes.route('/:offWorkRlId(\\d+)')
    .get(offWorkRLController.detailOffWorkRL);

// Create
routes.route('')
    .post(offWorkRLController.createOffWorkRL);

// Edit
routes.route('/:offWorkRlId(\\d+)')
    .put(offWorkRLController.updateOffWorkRL);

// Delete
routes.route('/delete')
    .delete(offWorkRLController.deleteOffWorkRL);

// Get User Review
routes.route('/:offWorkRlId(\\d+)/users')
    .get(offWorkRLController.getListUserReview);

// get options
routes.route('/get-options')
    .get(offWorkRLController.getOffworkRLOptions);


module.exports = {
    prefix,
    routes,
};
