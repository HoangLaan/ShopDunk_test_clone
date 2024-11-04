const express = require('express');
const controller = require('./borrow-request-lv.controller');
const routes = express.Router();
const prefix = '/borrow-review-lv';


routes.route('').post(controller.createBorrowRequestLv)
                      .get(controller.getListBorrowRequestLv)

// Get User Review
routes.route('/users')
  .get(controller.getListUserReview);


module.exports = {
  prefix,
  routes,
};
