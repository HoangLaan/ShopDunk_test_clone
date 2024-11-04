const express = require('express');
const controller = require('./borrow-request.controller');
const validate = require('express-validation');
const rules = require('./borrow-request.rule');
const routes = express.Router();
const prefix = '/borrow-request';

routes.route('').post(controller.createBorrowRequest);

routes.route('/get-list-review').get(controller.getListReviewByType);

// List borrow request
routes.route('').get(controller.getListBorrowRequest)
                .delete(controller.deleteBorrowRequest);;

// detail borrow request
routes.route('/:borrow_request_id(\\d+)').get(controller.getDetailBorrowRequest);    

routes.route('/:borrow_request_id(\\d+)/review').put(controller.reviewBorrowRequest);

module.exports = {
    prefix,
    routes,
};
