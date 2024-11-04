const express = require('express');
const reqeustPoRLController = require('./request-po-rl.controller');
const routes = express.Router();
const prefix = '/request-po-rl';


// List 
routes.route('')
    .get(reqeustPoRLController.getListRequestPoRL);

// Detail
routes.route('/:requestPoRlId(\\d+)')
    .get(reqeustPoRLController.detailRequestPoRL);

// Create
routes.route('')
    .post(reqeustPoRLController.createRequestPoRL);

// Edit
routes.route('/:requestPoRlId(\\d+)')
    .put(reqeustPoRLController.updateRequestPoRL);

// Delete
routes.route('/delete')
    .delete(reqeustPoRLController.deleteRequestPoRL);

// // Get User Review
// routes.route('/:reqeustPoRlId(\\d+)/users')
//     .get(reqeustPoRLController.getListUserReview);

// // get options
// routes.route('/get-options')
//     .get(reqeustPoRLController.getOffworkRLOptions);


module.exports = {
    prefix,
    routes,
};
